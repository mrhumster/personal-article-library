import React, {useEffect, useRef, useState} from "react";
import {useDeleteArticleMutation, useGetArticlesQuery} from "../../services/backend";
import {Table, TableColumn} from '@consta/uikit/Table';
import {IconSearchStroked} from '@consta/icons/IconSearchStroked'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {openSideBar, setActiveTab, setDragEvent} from "../../features/ui";
import Moment from "react-moment";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {Button} from "@consta/uikit/Button";
import {ArticleIFace} from "../../types";
import {customDenormalize} from "../../services/helpers.ts";
import { Text } from '@consta/uikit/Text';
import {IconFunnel} from "@consta/icons/IconFunnel";
import {DragLayout} from "../layout";
import {authorsToString} from '../../utils'
import openBook from '../../../assets/icons/open_book/open_book_m.svg'
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {IconTrash} from "@consta/icons/IconTrash";
import {IconPaste} from "@consta/icons/IconPaste";
import {IconDocExport} from "@consta/icons/IconDocExport"
import {TableTitle} from "./TableTitle.tsx";
import {addMessage, Item} from "../../features/alert";
import {SelectedPanel} from "./SelectedPanel.tsx";
import {IconRecord} from "@consta/icons/IconRecord"
import {IconFavoriteStroked} from "@consta/icons/IconFavoriteStroked"
import {IconFavoriteFilled} from "@consta/icons/IconFavoriteFilled"



export const TableArticles = ({filter, title}:{filter? : string[], title?: string}) => {
  const { refetch } = useGetArticlesQuery({}, {pollingInterval: 5000})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)

  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const ref = useRef<HTMLDivElement>(null)

  const [rows, setRows] = useState<ArticleIFace[]>()
  const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | undefined>(undefined)
  const [contextMenuArticleId, setContextMenuArticleId] = useState<string | null>(null)
  const [deleteArticle] = useDeleteArticleMutation()
  const [selected, setSelected] = useState<string[]>([])

  const headerCheckBox = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    refetch()
  }, [])

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

  const contextMenuItems: ContextMenuItemDefault[] = [
    {
      key: 1,
      label: 'Скопировать цитату',
      leftIcon: IconPaste,
      onClick: () => console.log('Copy')
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
      width: 40,
      renderCell: (row: ArticleIFace) =>
        <div className='flex justify-items-center'>
          { !row.read && <IconRecord view={'success'} size={'m'}/> }
        </div>

    },
    {
      title: '',
      width: 40,
      renderCell: (row: ArticleIFace) =>
        <div className='flex justify-items-center w-full h-full'>
        { row.favorite ? <IconFavoriteFilled className='my-auto' view={'warning'} size={'s'}/> :
          <IconFavoriteStroked className='my-auto' view={'ghost'} size={'s'}/> }
        </div>
    },
    {
      title: 'Автор',
      accessor: 'authors',
      align: 'center',
      sortable: true,
      width: 200,
      renderCell: (row: ArticleIFace) =>
        <div onContextMenu={showContextMenu} draggable="true" className={'mt-auto mb-auto'}>
          {row.authors ? authorsToString(row.authors) :
            <Text size={'xs'} fontStyle={"italic"}>Пусто</Text>
          }
        </div>
    },
    {
      title: 'Год',
      accessor: 'year',
      sortable: true,
      width: 100,
      renderCell: (row: ArticleIFace) =>
        <Text className={'mt-auto mb-auto'} truncate size={'xs'} draggable="true" onContextMenu={showContextMenu}>
          {row.publication?.year}
        </Text>
    },
    {
      title: 'Название',
      accessor: 'title',
      sortable: true,
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
      title: 'Источник',
      accessor: "source"
    },
    {
      title: 'Добавлен',
      accessor: "added",
      sortable: true,
      width: 110,
      renderCell: (row: ArticleIFace) =>
        <Text className={'mt-auto mb-auto'}
              size={'xs'}
              truncate
              onContextMenu={showContextMenu}>
          <Moment date={row.added} format="DD.MM.YYYY"/>
        </Text>
    },
    {
      title: 'Файл',
      accessor: "file_name",
      width: 75,
      renderCell: (row: ArticleIFace) => <div className={'mb-auto mt-auto'} >{row.files ? <IconDocExport size={'s'} view={'secondary'}/> : <></>}</div>
    }
  ];

  useEffect(() => {
    const allArticles = customDenormalize(ids, entities)
    if (filter) setRows(allArticles.filter((value: ArticleIFace) => filter.includes(value.id)).filter((value: ArticleIFace) => !value.deleted))
    if (!filter) setRows(allArticles.filter((value: ArticleIFace) => !value.deleted))
  }, [ids, entities, filter])


  const handleRowClick = (arg: { id: string; e: React.MouseEvent }) => {
    dispatch(openSideBar({id: arg.id}))
    dispatch(setActiveTab(0))
  }

  const display = (event: DragEvent) => {
    dispatch(setDragEvent({
      isActive: true,
      kind: event.dataTransfer?.items[0].kind,
      type: event.dataTransfer?.items[0].type
    }))
  }

  const hide = () => {
    dispatch(setDragEvent({isActive: false}))
  }

  const handlerDragStart = (event: DragEvent) => {
    const img = new Image()
    img.src = openBook
    event.dataTransfer?.setData('text/plain', 'article')
    event.dataTransfer?.setDragImage(img, 12, 12)
  }


  return (
    <Theme preset={presetGpnDefault}>
      {/* TODO: Плохо работает драг. Если увести файл и бросить за область, то поле не исчезает */}
      <div ref={ref} onDragStart={handlerDragStart} onDragOver={display} onDragEnd={hide}
           className='h-screen w-full relative flex flex-col justify-between'>
        <DragLayout/>
        <div className={`h-[5%] flex items-center border-b border-slate-300 justify-items-stretch ${isOpen ? 'w-3/4' : 'w-full'}`}>
          <TableTitle title={title}/>
          <div id='buttons' className={`flex ${isOpen ? 'me-20' : 'me-2'}`}>
            <div className='p-1'>
              <Button label='Поиск' size={'m'} view={'clear'} iconLeft={IconSearchStroked}/>
            </div>
            <div className='p-1'>
              <Button label='Фильтр' size={'m'} view={'clear'} iconLeft={IconFunnel}/>
            </div>
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
                  emptyRowsPlaceholder={<Text>Здесь пока нет данных</Text>}
              />

          }
        </div>
        <div id='selectedPanelContainer' className={selected.length > 0 ? 'h-[7%]' : 'h-none'}>
          <SelectedPanel items={selected}/>
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
    </Theme>
  )
}