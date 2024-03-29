import React, {useEffect, useRef, useState} from "react";
import {
  useDeleteArticleMutation,
  useGetArticleListStringMutation,
  useGetArticlesQuery,
  useGetArticleStringQuery
} from "../../services/backend";
import {SortByProps, Table, TableColumn, TableFilters, TableTextFilter} from '@consta/uikit/Table';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {openSideBar, setDragEvent} from "../../features/ui";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {ArticleIFace, AuthorIFace} from "../../types";
import {customDenormalize} from "../../services/helpers.ts";
import {Text} from '@consta/uikit/Text';
import {DragLayout} from "../layout";
import {authorToString, copyTextToClipboard} from '../../utils'
import line from '../../../assets/images/line.svg'
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {IconTrash} from "@consta/icons/IconTrash";
import {IconPaste} from "@consta/icons/IconPaste";
import {IconDocExport} from "@consta/icons/IconDocExport"
import {TableTitle} from "./TableTitle.tsx";
import {addMessage, Item} from "../../features/alert";
import {SelectedPanel} from "./SelectedPanel.tsx";
import {AuthorsCell, FavoriteCell, ReadCell} from "./table_cells";
import moment from "moment";
import {ElasticSearch, SearchModal} from "./search";


type TableArticlesIFace = {
  filter?: string[],
  title?: string
}

export const TableArticles = ({filter, title}: TableArticlesIFace) => {
  const {refetch} = useGetArticlesQuery({}, {pollingInterval: 50000})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const selectedRow = useSelector((state: RootState) => state.ui.rightSideBar.article?.id)
  const ref = useRef<HTMLDivElement>(null)
  const selected_menu_item = useSelector((state: RootState) => state.ui.checked)
  const [rows, setRows] = useState<ArticleIFace[]>()
  const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | undefined>(undefined)
  const [contextMenuArticleId, setContextMenuArticleId] = useState<string | null>(null)
  const [deleteArticle] = useDeleteArticleMutation()
  const [selected, setSelected] = useState<string[]>([])
  const [idForRequest, setIdForRequest] = useState<string | null>(null)
  const articleString = useGetArticleStringQuery(idForRequest, {skip: !idForRequest})
  const [getArticleListString, getArticleListStringResult] = useGetArticleListStringMutation()
  const headerCheckBox = useRef(null)
  const [sortSetting, setSortSetting] = useState<SortByProps<ArticleIFace> | null>(null);
  const dispatch = useDispatch()


  const dragImage = new Image()
  dragImage.src = line

  const sortBy = (rows: ArticleIFace[] | undefined, settings: SortByProps<ArticleIFace> | null) => {
    if (settings?.sortingBy === 'publication') {
      return rows?.sort((a, b) => {
        const [firstYear, secondYear] = settings.sortOrder === 'asc' ? [a.publication?.year, b.publication?.year] : [b.publication?.year, a.publication?.year];
        return Number(firstYear) - Number(secondYear)
      });
    }
    if (settings?.sortingBy === 'title') {
      return rows?.sort((a, b) => {
        const [firstTitle, secondTitle] = settings.sortOrder === 'asc' ? [a.title, b.title] : [b.title, a.title]
        if (firstTitle && secondTitle) {
          if (firstTitle.toLowerCase() > secondTitle.toLowerCase()) return 1;
          if (firstTitle.toLowerCase() < secondTitle.toLowerCase()) return -1;
        }
        return 0;
      });
    }
    return rows
  }

  useEffect(() => {
    if (getArticleListStringResult.data) {
      copyTextToClipboard(getArticleListStringResult.data.articles_string)
        .then(() => {
          dispatch(addMessage({'message': 'Ссылки скопированы в буфер'}))
        }).catch((error) => {
        dispatch(addMessage({'message': error.toString(), 'status': 'alert'}))
      })
    }
  }, [getArticleListStringResult])

  const copySelectedArticleString = () => {
    getArticleListString(selected)
  }

  useEffect(() => {
    setSelected([])
  }, [filter])

  useEffect(() => {
    if (rows) {
      const row_ids = rows.map((article: ArticleIFace) => article.id)
      selected.map((item) => {
        if (!row_ids?.includes(item)) setSelected(prevState => prevState.filter((selected_article_id) => item !== selected_article_id))
      })
    }
  }, [rows])


  useEffect(() => {
    const allArticles = customDenormalize(ids, entities)
    if (filter) setRows(allArticles.filter((value: ArticleIFace) => filter.includes(value.id)).filter((value: ArticleIFace) => !value.deleted))
    if (!filter) setRows(allArticles.filter((value: ArticleIFace) => !value.deleted))
    if (selected_menu_item.id === '1') setRows((prevState) => prevState?.filter((row) => moment(row.added).isAfter(moment().subtract(7, 'days'))))
    if (selected_menu_item.id === '3') setRows(prevState => prevState?.filter(row => row.favorite))
    if (selected_menu_item.id === '2') setRows(prevState => prevState?.filter(row => row.read && moment(row.read_date).isAfter(moment().subtract(7, 'days'))))
    setRows((prevState) => sortBy(prevState, sortSetting))
  }, [ids, entities, filter, selected_menu_item, sortSetting])

  const drag = (e: React.DragEvent<HTMLDivElement>) => {
    const article_id = (e.target as HTMLElement).getAttribute('data-article-id')
    if (article_id) e.dataTransfer.setData("article_id", article_id);
  }

  const showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const article_id = (e.target as HTMLElement).getAttribute('data-article-id')
    setContextMenuArticleId(article_id)
    setContextMenuPosition({x: e.pageX, y: e.pageY})
    setIsOpenContextMenu(true)
  }

  const deleteArticleHandler = () => {
    if (contextMenuArticleId) deleteArticle(contextMenuArticleId)
    setIsOpenContextMenu(false)
    const alert: Item = {
      message: 'Ссылка перемещена в корзину',
      status: "normal",
      progressMode: 'timer',
    }
    refetch()
    dispatch(addMessage(alert))
  }

  useEffect(() => {
    if (headerCheckBox.current && rows) {
      if (selected.length > 0 && selected.length < rows.length) {
        (headerCheckBox.current as HTMLInputElement).indeterminate = true;
      }
      if (selected.length === rows.length) {
        (headerCheckBox.current as HTMLInputElement).indeterminate = false;
        (headerCheckBox.current as HTMLInputElement).checked = true;
      }
      if (selected.length === 0) {
        (headerCheckBox.current as HTMLInputElement).indeterminate = false;
        (headerCheckBox.current as HTMLInputElement).checked = false;
      }
    }
  }, [selected])

  const checkBoxChangeHandler = (e: React.ChangeEvent) => {
    e.stopPropagation();
    const article_id = (e.target as HTMLInputElement).getAttribute('data-article-id')
    if (article_id) {
      if (selected.includes(article_id)) {
        setSelected(selected.filter((value: string) => value !== article_id))
      } else {
        setSelected([...selected, article_id])
      }
    }
  }

  const headerCheckBoxHandler = (e: React.ChangeEvent) => {
    if ((e.target as HTMLInputElement).checked && rows) {
      setSelected(rows.map((row: ArticleIFace) => row.id))
    }
    if (!(e.target as HTMLInputElement).checked && rows) {
      setSelected([])
    }
  }

  const copyArticleStringHandler = () => {
    if (contextMenuArticleId) setIdForRequest(contextMenuArticleId)
    setIsOpenContextMenu(false)
  }

  useEffect(() => {
    if (articleString.data && 'link' in articleString.data) {
      copyTextToClipboard(articleString.data['link']).then(() => {
        dispatch(addMessage({'message': 'Ссылка скопирована в буфер', 'status': 'success'}))
      }).catch((error) => {
        dispatch(addMessage({'message': error.toString(), 'status': 'alert'}))
      })
    }
  }, [articleString.data])

  const contextMenuItems: ContextMenuItemDefault[] = [
    {
      key: 1,
      label: 'Скопировать цитату',
      leftIcon: IconPaste,
      onClick: copyArticleStringHandler
    },
    {
      key: 2,
      label: 'Удалить ссылку',
      leftIcon: IconTrash,
      onClick: deleteArticleHandler
    }
  ]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const columns: TableColumn<typeof rows[number]>[] = [
    {
      title: <input ref={headerCheckBox}
                    type='checkbox'
                    onChange={headerCheckBoxHandler}
                    id='selectedCheckBoxHeader'
      />,
      width: 30,
      renderCell: (row: ArticleIFace) =>
        <div className='flex justify-items-center h-full w-full'>
          <input type='checkbox'
                 checked={selected.includes(row.id)}
                 onChange={checkBoxChangeHandler}
                 onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                 data-article-id={row.id}
          />
        </div>
    },
    {
      title: '',
      width: 35,
      renderCell: (row: ArticleIFace) => <ReadCell article={row}/>
    },
    {
      title: '',
      width: 35,
      renderCell: (row: ArticleIFace) => <FavoriteCell article={row}/>
    },
    {
      title: 'Авторы',
      accessor: 'authors',
      align: 'left',
      width: 200,
      renderCell: (row: ArticleIFace) => <AuthorsCell items={row.authors}/>
    },
    {
      title: 'Год',
      accessor: 'publication',
      width: 80,
      sortable: true,
      renderCell: (row: ArticleIFace) =>
        <Text className={'mt-auto mb-auto'} truncate size={'xs'} draggable="true" onContextMenu={showContextMenu}>
          {row.publication?.year}
        </Text>
    },
    {
      title: 'Название',
      accessor: 'title',
      sortable: true,
      width: 'auto',
      renderCell: (row: ArticleIFace) =>
        <Text truncate
              size={'xs'}
              className="w-full p-0 mt-auto mb-auto"
              draggable="true"
              onDragStart={drag}
              onContextMenu={showContextMenu}
              data-article-id={row.id}
        >
          {row.title}
        </Text>
    },
    {
      title: 'Добавлен',
      accessor: "added",
      width: 110,
      renderCell: (row: ArticleIFace) =>
        <Text className={'mt-auto mb-auto'}
              size={'xs'}
              view={'secondary'}
              truncate
              onContextMenu={showContextMenu}>
          {moment(row.added).fromNow()}
        </Text>
    },
    {
      title: 'Файл',
      accessor: "file_name",
      width: 75,
      renderCell: (row: ArticleIFace) => <div className={'mb-auto mt-auto'}>{row.files ?
        <IconDocExport size={'s'} view={'secondary'}/> : <></>}</div>
    }
  ];

  const handleRowClick = (arg: { id?: string | undefined; e?: React.SyntheticEvent<Element, Event> | undefined }) => {
    dispatch(openSideBar({id: arg.id}))
  }

  const display = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dispatch(setDragEvent({
      isActive: true,
      kind: event.dataTransfer?.items[0].kind,
      type: event.dataTransfer?.items[0].type
    }))
  }

  const hide = () => {
    dispatch(setDragEvent({isActive: false}))
  }

  const handlerDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setDragImage(dragImage, 50, 10)
    event.dataTransfer?.setData('text/plain', 'article')
  }


  const filters: TableFilters<ArticleIFace> = [
    {
      id: 'authors',
      name: 'Автор: ',
      field: 'authors',
      filterer: (cellValue: AuthorIFace[], filterValues: Array<{ value: AuthorIFace; name: string }>,) => {
        return filterValues.some(
          (filterValue) => {
            const match = cellValue.filter(value =>
              value.last_name === filterValue.value.last_name &&
              value.first_name === filterValue.value.first_name &&
              value.sur_name === filterValue.value.sur_name
            )
            return filterValue && match.length !== 0
          },
        );
      },
      component: {
        name: TableTextFilter,
        props: {
          withSearch: true,
          items: [...new Set(rows?.map(row => row.authors)
            .flat()
            .sort((a, b) => {
              const fa = a && a.last_name ? a.last_name : '',
                fb = b && b.last_name ? b.last_name : '';
              if (fa && fb) {
                if (fa < fb) {
                  return -1;
                }
                if (fa > fb) {
                  return 1;
                }
              }
              return 0;
            }))].map(value => {
            return {
              name: authorToString(value),
              value: value
            }
          })
        },
      },
    }
  ];

  return (
    <Theme preset={presetGpnDefault}>

      <div ref={ref} onDragStart={handlerDragStart} onDragOver={display} onDragEnd={hide}
           className='h-screen w-full relative flex flex-col justify-between'>
        <DragLayout/>
        <div className={`h-[5%] flex items-center border-b border-slate-300 justify-items-stretch`}>
          <TableTitle title={title}/>
          <div id='buttons' className={`flex`}>
            <ElasticSearch/>
          </div>
        </div>
        <div id='tableContainer' className={`grow overflow-y-auto ${selected.length > 0 ? 'h-[88%]' : 'h-[95%]'}`}>
          {rows &&
              <Table
                  size={'s'}
                  rows={rows}
                  columns={columns}
                  onRowClick={handleRowClick}
                  getCellWrap={() => 'break'}
                  stickyHeader
                  isResizable
                  activeRow={{id: selectedRow, onChange: handleRowClick}}
                  emptyRowsPlaceholder={<Text>Здесь пока нет данных</Text>}
                  filters={filters}
                  onSortBy={setSortSetting}
              />
          }
        </div>
        <div id='selectedPanelContainer' className={selected.length > 0 ? 'h-[7%]' : 'h-none'}>
          <SelectedPanel items={selected} copySelectedArticleString={copySelectedArticleString}/>
        </div>
      </div>
      {isOpenContextMenu && contextMenuPosition &&
          <ContextMenu
              size='s'
              direction='rightStartDown'
              isOpen={isOpenContextMenu}
              position={contextMenuPosition}
              items={contextMenuItems}
              onClickOutside={() => setIsOpenContextMenu(false)}
          />
      }
      <SearchModal/>
    </Theme>
  )
}