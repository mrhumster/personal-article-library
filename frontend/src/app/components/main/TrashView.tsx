import React, {useEffect, useRef, useState} from "react";
import {useDeleteArticleMutation, useGetArticlesQuery} from "../../services/backend";
import {Table, TableColumn} from '@consta/uikit/Table';
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import Moment from "react-moment";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {ArticleIFace} from "../../types";
import {customDenormalize} from "../../services/helpers.ts";
import { Text } from '@consta/uikit/Text';
import {authorsToString} from '../../utils'
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {IconTrash} from "@consta/uikit/IconTrash";
import {IconPaste} from "@consta/uikit/IconPaste";
import {TableTitle} from "./TableTitle.tsx";


export const TrashView = () => {
  const {refetch} = useGetArticlesQuery({}, {pollingInterval: 10000})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const [articles, setArticles] = useState<ArticleIFace[]>()
  const ref = useRef<HTMLDivElement>(null)

  const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | undefined >(undefined)
  const [contextMenuArticleId, setContextMenuArticleId] = useState<string | null>(null)
  const [ deleteArticle ] = useDeleteArticleMutation()

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
      renderCell: (row: ArticleIFace) => <div>{row.authors ? authorsToString(row.authors) :
        <div className={"italic"}>Пусто</div>}</div>
    },
    {
      title: 'Год',
      accessor: 'year',
      sortable: true,
      renderCell: (row: ArticleIFace) => <div>{row.publication?.year}</div>
    },
    {
      title: 'Название',
      accessor: 'title',
      sortable: true,
      renderCell: (row: ArticleIFace) =>
        <div onContextMenu={showContextMenu}
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
    }
  ];

  useEffect(() => {
    setArticles(customDenormalize(ids, entities))
  }, [ids, entities])


  useEffect(() => {refetch()}, [])


  return (
    <Theme preset={presetGpnDefault}>
      <div ref={ref} className='h-screen w-full relative'>
        <div
          className={`flex items-center border-b border-slate-300 justify-items-stretch ${isOpen ? 'w-3/4' : 'w-full'}`}>
          <TableTitle title='Корзина' />
        </div>
        {articles &&
            <Table
                rows={ articles.filter((value) => value.deleted)}
                columns={columns}
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