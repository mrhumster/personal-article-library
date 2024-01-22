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
import {IconFunnel} from "@consta/uikit/IconFunnel";
import {DragLayout} from "../layout";
import {authorsToString} from '../../utils'
import openBook from '../../../assets/icons/open_book/open_book_m.svg'
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {IconTrash} from "@consta/uikit/IconTrash";
import {IconPaste} from "@consta/uikit/IconPaste";
import {IconDocExport} from "@consta/uikit/IconDocExport"
import {TableTitle} from "./TableTitle.tsx";
import {addMessage, Item} from "../../features/alert";


export const TableArticles = ({filter, title}:{filter? : string[], title?: string}) => {
  const { refetch } = useGetArticlesQuery({}, {pollingInterval: 5000})
  const { ids, entities} = useSelector((state: RootState) => state.articles.articles)

  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const ref = useRef<HTMLDivElement>(null)

  const [ rows, setRows] = useState<ArticleIFace[]>()
  const [ isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [ contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | undefined >(undefined)
  const [ contextMenuArticleId, setContextMenuArticleId] = useState<string | null>(null)
  const [ deleteArticle ] = useDeleteArticleMutation()
  const [ selected, setSelected ] = useState<string[]>([])

  const headerCheckBox = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {refetch()}, [])

  useEffect(()=>{setSelected([])}, [filter])

  const drag = (e: React.DragEvent<HTMLDivElement>) => {
    const article_id = (e.target as HTMLElement).getAttribute('data-article-id')
    if (article_id) e.dataTransfer.setData("article_id", article_id);
  }

  const showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const article_id = (e.target as HTMLElement).getAttribute('data-article-id')
    setContextMenuArticleId(article_id)
    setContextMenuPosition({ x: e.pageX, y: e.pageY })
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
      label: 'Скопировать цитату',
      leftIcon: IconPaste,
      onClick: () => console.log('Copy')
    },
    {
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
      renderCell: (row: ArticleIFace) =>
        <input type='checkbox'
               key={row.id}
               checked={selected.includes(row.id)}
               onChange={checkBoxChangeHandler}
               onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
               data-article-id={row.id}
        />
    },
    {
      title: 'Автор',
      accessor: 'authors',
      align: 'center',
      sortable: true,
      width: 200,
      renderCell: (row: ArticleIFace) => <div draggable="true">{row.authors ? authorsToString(row.authors) :
        <div className={"italic"}>Пусто</div>}</div>
    },
    {
      title: 'Год',
      accessor: 'year',
      sortable: true,
      renderCell: (row: ArticleIFace) => <div draggable="true">{row.publication?.year}</div>
    },
    {
      title: 'Название',
      accessor: 'title',
      sortable: true,
      renderCell: (row: ArticleIFace) =>
        <div className="w-full p-0"
          draggable="true"
          onDragStart={drag}
          onContextMenu={showContextMenu}
          data-article-id={row.id}
        >
          {row.title}
        </div>
    },
    {
      title: 'Источник',
      accessor: "source"
    },
    {
      title: 'Добавлен',
      accessor: "added",
      sortable: true,
      renderCell: (row: ArticleIFace) => <div><Moment date={row.added} format="DD.MM.YYYY"/></div>
    },
    {
      title: 'Файл',
      accessor: "file_name",
      renderCell: (row: ArticleIFace) => <div>{row.files ? <IconDocExport /> : <></>}</div>
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
      <div ref={ref} onDragStart={handlerDragStart} onDragOver={display} onDragEnd={hide} className='h-screen w-full relative'>
        <DragLayout/>
        <div
          className={`flex items-center border-b border-slate-300 justify-items-stretch ${isOpen ? 'w-3/4' : 'w-full'}`}>
          <TableTitle title={title} />
          <div id='buttons' className={`flex ${isOpen ? 'me-20' : 'me-2'}`}>
            <div className='p-1'>
              <Button label='Поиск' size={'m'} view={'clear'} iconLeft={IconSearchStroked}/>
            </div>
            <div className='p-1'>
              <Button label='Фильтр' size={'m'} view={'clear'} iconLeft={IconFunnel}/>
            </div>
          </div>
        </div>
        {rows &&
            <Table
                rows={rows}
                columns={columns}
                onRowClick={handleRowClick}
                getCellWrap={() => 'break'}
                isResizable={false}
                stickyHeader
                emptyRowsPlaceholder={<Text>Здесь пока нет данных</Text>}
            />
        }
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