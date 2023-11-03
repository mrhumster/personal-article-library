import React, {useEffect} from "react";
import {useGetArticlesQuery} from "../../services/backend";
import {Table, TableColumn} from '@consta/uikit/Table';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {openSideBar} from "../../features/ui";

export const AllReferences = () => {
  const {refetch} = useGetArticlesQuery({})
  const articles = useSelector((state: RootState) => state.articles.articles)
  const dispatch = useDispatch()
  useEffect(()=> {
    refetch()
  }, [])

  const handleRowClick = (arg: { id: string; e: React.MouseEvent }) => {
    console.log(arg)
    dispatch(openSideBar({id: arg.id}))
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
      renderCell: (row) => <div>{new Date(row.added).toString()}</div>
    },
    {
      title: 'Файл',
      accessor: "file_name",
      renderCell: (row) => <div>{row.file_name? <div>Есть</div>: <></>}</div>
    }
  ];
  return (
      <div className='h-screen'>
        <Table rows={articles} columns={columns} onRowClick={handleRowClick} isResizable={true}/>
      </div>
  )
}