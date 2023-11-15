import React, {useEffect, useRef, useState} from "react";
import {useGetArticlesQuery} from "../../services/backend";
import {Table, TableColumn} from '@consta/uikit/Table';
import {IconSearchStroked} from '@consta/icons/IconSearchStroked'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {openSideBar, setActiveAllReferenceDragNDropField, setActiveTab} from "../../features/ui";
import Moment from "react-moment";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {Button} from "@consta/uikit/Button";
import {ArticleIFace} from "../../types";
import {customDenormalize} from "../../services/helpers.ts";
import { Text } from '@consta/uikit/Text';
import {IconFunnel} from "@consta/uikit/IconFunnel";
import {DragLayout} from "../layout";
import {authorsToString} from '../../utils'

export const AllReferences = () => {
  const { refetch } = useGetArticlesQuery({},{pollingInterval: 10000})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const isOpen = useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen)
  const [articles, setArticles] = useState<ArticleIFace[]>()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setArticles(customDenormalize(ids, entities))
  }, [ids, entities])


  const dispatch = useDispatch()
  useEffect(() => {
    refetch()
  }, [])

  const handleRowClick = (arg: { id: string; e: React.MouseEvent }) => {
    dispatch(openSideBar({id: arg.id}))
    dispatch(setActiveTab(0))
  }

  const display = () => {
    dispatch(setActiveAllReferenceDragNDropField(true))
  }

  const hide = () => {
    dispatch(setActiveAllReferenceDragNDropField(false))
  }

  useEffect(()=>{
    if (ref.current) {
      ref.current.addEventListener('dragover', display)
      ref.current.addEventListener('dragend', hide)
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('dragover', display)
        ref.current.removeEventListener('dragend', hide)
      }
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const columns: TableColumn<typeof articles[number]>[] = [
    {
      title: 'Автор',
      accessor: 'authors',
      align: 'center',
      sortable: true,
      width: 200,
      renderCell: (row: ArticleIFace) => <div>{row.authors ? authorsToString(row.authors) : <div className={"italic"}>Пусто</div>}</div>
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
      sortable: true
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
  return (
    <Theme preset={presetGpnDefault}>
      <div ref={ref} className='h-screen w-full relative'>
        <DragLayout  />
        <div className={`flex items-center border-b border-slate-300 justify-items-stretch ${isOpen ? 'w-3/4' : 'w-full'}`}>
          <Text size={'l'} className='ms-5 font-light flex-grow whitespace-nowrap select-none tracking-tighter'>
            Все ссылки
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
        {articles && <Table
            rows={articles}
            columns={columns}
            onRowClick={handleRowClick}
            getCellWrap={() => 'break'}
            isResizable={false}/>}
      </div>
    </Theme>
  )
}