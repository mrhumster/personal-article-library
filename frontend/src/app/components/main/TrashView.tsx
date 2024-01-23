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
import {IconTrash} from "@consta/icons/IconTrash";
import {IconPaste} from "@consta/icons/IconPaste";
import {TableTitle} from "./TableTitle.tsx";
import {SelectedPanel} from "./SelectedPanel.tsx";


export const TrashView = () => {
  const {refetch} = useGetArticlesQuery({}, {pollingInterval: 10000})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const [rows, setRows] = useState<ArticleIFace[]>()
  const ref = useRef<HTMLDivElement>(null)

  const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | undefined >(undefined)
  const [contextMenuArticleId, setContextMenuArticleId] = useState<string | null>(null)
  const [ deleteArticle ] = useDeleteArticleMutation()
  const headerCheckBox = useRef(null)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const allArticles = customDenormalize(ids, entities)
    setRows(allArticles.filter((value: ArticleIFace) => value.deleted))
  }, [ids, entities])

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

  const showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const article_id = (e.target as HTMLElement).getAttribute('data-article-id')
    setContextMenuArticleId(article_id)
    setContextMenuPosition({ x: e.pageX, y: e.pageY })
    setIsOpenContextMenu(true)
  }

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
  const columns: TableColumn<typeof rows[number]>[] = [
    {
      title: <input ref={headerCheckBox}
                    type='checkbox'
                    onChange={headerCheckBoxHandler}
                    id='selectedCheckBoxHeader'
      />,
      width: 45,
      renderCell: (row: ArticleIFace) =>
        <input type='checkbox'
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

  useEffect(() => {refetch()}, [])


  return (
    <Theme preset={presetGpnDefault}>
      <div ref={ref} className='h-screen w-full relative flex flex-col justify-between'>
        <div
          className={`flex items-center border-b border-slate-300 justify-items-stretch ${isOpen ? 'w-3/4' : 'w-full'}`}>
          <TableTitle title='Корзина' />
        </div>
        <div id='tableContainer' className='grow'>
        {rows &&
            <Table
                rows={rows}
                columns={columns}
                getCellWrap={() => 'break'}
                isResizable
                emptyRowsPlaceholder={<Text>Здесь пока нет данных</Text>}
            />
        }
        </div>

        <div id='selectedPanelContainer'>
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