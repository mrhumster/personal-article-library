import React, {useEffect} from "react";
import {useGetArticlesQuery} from "../../services/backend";
import {Table, TableColumn} from '@consta/uikit/Table';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {openSideBar, setActiveTab} from "../../features/ui";
import Moment from "react-moment";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";

export const AllReferences = () => {
  const {refetch} = useGetArticlesQuery({})
  const articles = useSelector((state: RootState) => state.articles.articles)
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
      renderCell: (row) => <div><Moment date={row.added} format="DD.MM.YYYY"/></div>
    },
    {
      title: 'Файл',
      accessor: "file_name",
      renderCell: (row) => <div>{row.file_name? <div>Есть</div>: <></>}</div>
    }
  ];
  return (
    <Theme preset={presetGpnDefault}>
      <div className='h-screen w-full'>
        <Table rows={articles} columns={columns} onRowClick={handleRowClick} isResizable={true}/>
      </div>
    </Theme>
  )
}