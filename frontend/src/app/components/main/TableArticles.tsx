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


export const TableArticles = ({filter, title}:{filter? : string[], title?: string}) => {
  const {refetch} = useGetArticlesQuery({}, {pollingInterval: 10000})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const [articles, setArticles] = useState<ArticleIFace[]>()
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | undefined >(undefined)
  const [contextMenuArticleId, setContextMenuArticleId] = useState<string | null>(null)
  const [ deleteArticle ] = useDeleteArticleMutation()

  function drag(e: React.DragEvent<HTMLDivElement>) {
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
  const columns: TableColumn<typeof articles[number]>[] = [
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
        <div draggable="true"
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
      renderCell: (row: ArticleIFace) => <div>{row.files ? <div>✅</div> : <></>}</div>
    }
  ];

  useEffect(() => {
    setArticles(customDenormalize(ids, entities))
  }, [ids, entities])


  useEffect(() => {
    refetch()
  }, [])

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

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('dragstart', handlerDragStart)
      ref.current.addEventListener('dragover', display)
      ref.current.addEventListener('dragend', hide)
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('dragstart', handlerDragStart)
        ref.current.removeEventListener('dragover', display)
        ref.current.removeEventListener('dragend', hide)
      }
    }
  }, [])


  return (
    <Theme preset={presetGpnDefault}>
      <div ref={ref} className='h-screen w-full relative'>
        <DragLayout/>
        <div
          className={`flex items-center border-b border-slate-300 justify-items-stretch ${isOpen ? 'w-3/4' : 'w-full'}`}>
          <Text size={'l'}
                className='ms-5 font-light flex-grow whitespace-nowrap select-none tracking-tighter truncate w-64'>
            {title}
          </Text>
          <div id='buttons' className={`flex ${isOpen ? 'me-20' : 'me-2'}`}>
            <div className='p-1'>
              <Button label='Поиск' size={'m'} view={'clear'} iconLeft={IconSearchStroked}/>
            </div>
            <div className='p-1'>
              <Button label='Фильтр' size={'m'} view={'clear'} iconLeft={IconFunnel}/>
            </div>
          </div>
        </div>
        {articles &&
            <Table
                rows={filter ? articles.filter((value) =>
                  // Фильтр по коллекции и не удаленные
                  filter.includes(value.id)).filter((value) => !value.deleted) :
                  // Фильтр по ну удаленным
                  articles.filter((value) => !value.deleted)}
                columns={columns}
                onRowClick={handleRowClick}
                getCellWrap={() => 'break'}
                isResizable={false}
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