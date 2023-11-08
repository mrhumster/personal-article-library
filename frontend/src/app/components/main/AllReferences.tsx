import React, {useEffect, useState} from "react";
import {useGetArticlesQuery} from "../../services/backend";
import {Table, TableColumn} from '@consta/uikit/Table';
import {IconSearchStroked} from '@consta/icons/IconSearchStroked'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {openSideBar, setActiveTab} from "../../features/ui";
import Moment from "react-moment";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {Button} from "@consta/uikit/Button";
import {ArticleIFace, AuthorIFace} from "../../types";
import {customDenormalize} from "../../services/helpers.ts";
import { Text } from '@consta/uikit/Text';

export const authorsToString = (authors: AuthorIFace[]) => {
  let content
  if (authors.length > 0) {
    const authorsList = authors.map(({first_name, last_name}) => `${last_name} ${first_name ? first_name[0] : ''}.`)
    content = authorsList.map((author, index) => <span key={index} className="mx-1">{author}</span>)
  } else {
    content = <span>Нет автора</span>
  }
  return <Text size={'s'} fontStyle={'italic'} weight={'light'}>{content}</Text>
}

export const AllReferences = () => {
  const {refetch} = useGetArticlesQuery({})
  const {ids, entities} = useSelector((state: RootState) => state.articles.articles)
  const [articles, setArticles] = useState<ArticleIFace[]>()

  useEffect(() => {
    setArticles(customDenormalize(ids, entities))
  }, [ids, entities])


  const dispatch = useDispatch()
  useEffect(()=> {
    refetch()
  }, [])

  const handleRowClick = (arg: { id: string; e: React.MouseEvent }) => {
    dispatch(openSideBar({id: arg.id}))
    dispatch(setActiveTab(0))
  }

  const columns: TableColumn<typeof articles[number]>[] = [
    {
      title: 'Автор',
      accessor: 'authors',
      align: 'center',
      sortable: true,
      renderCell: (row: ArticleIFace) => <div>{authorsToString(row.authors)}</div>
    },
    {
      title: 'Год',
      accessor: 'year',
      sortable: true,
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
      renderCell: (row: ArticleIFace) => <div><Moment date={row.added} format="DD.MM.YYYY"/></div>
    },
    {
      title: 'Файл',
      accessor: "file_name",
      renderCell: (row: ArticleIFace) => <div>{row.file_name? <div>✅</div>: <></>}</div>
    }
  ];
  return (
    <Theme preset={presetGpnDefault}>
      <div className='h-screen w-full'>
        <div className='flex'>
          <div className='p-2'>
            Все ссылки
          </div>
          <div className='p-2'>
            <Button label='Поиск' size={'xs'} view={'clear'} iconLeft={IconSearchStroked}/>
          </div>
        </div>
        {articles && <Table
            rows={articles}
            columns={columns}
            onRowClick={handleRowClick}
            getCellWrap={() => 'break'}
            isResizable={false} />}
      </div>
    </Theme>
  )
}