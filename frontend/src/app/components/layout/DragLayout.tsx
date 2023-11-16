import {DragNDropField} from "@consta/uikit/DragNDropField";
import {Text} from "@consta/uikit/Text";
import React, {useEffect} from "react";
import {
  setActiveAllReferenceDragNDropField,
  setError,
  setFileInProgress,
  setLoading,
  setSuccess,
  showUploadProgress
} from "../../features/ui";
import {filesize} from "filesize";
import moment from "moment/moment";
import {useAddFileMutation, useCreateArticleMutation, useGetArticlesQuery} from "../../services/backend";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {CreateArticleIFace} from "../../types";

export const DragLayout = () => {
  const visible = useSelector((state: RootState) => state.ui.dragndrop.activeAllReferenceDragNDropField)
  const [files, setFiles] = React.useState<File[]>();
  const [addFile, addFileResult] = useAddFileMutation()
  const [addArticle, isSuccess] = useCreateArticleMutation()
  const { refetch } = useGetArticlesQuery(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess])

  useEffect(()=>{
    if (files) {
      const file = files[0]
      const form_data = new FormData()
      form_data.append('attach', file)
      addFile(form_data)
      const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2)
      dispatch(setFileInProgress({
        name: file.name,
        extension: extension,
        description: `${extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.lastModified).format('DD MMMM YYYY')}`
      }))
      dispatch(setActiveAllReferenceDragNDropField(false))
    }
  }, [files])

  useEffect(() => {
    if (addFileResult.data) {
      const newArticle: CreateArticleIFace = {
        title: addFileResult.data.file_name,
        files: [addFileResult.data.id]
      }
      addArticle(newArticle)
    }
  }, [addFileResult.isSuccess, addFileResult.data])

  useEffect(() => {
    dispatch(setLoading(addFileResult.isLoading))
  }, [addFileResult.isLoading])

  useEffect(()=> {
    dispatch(setSuccess(addFileResult.isSuccess))
  }, [addFileResult.isSuccess])

  useEffect(() => {
    dispatch(setError(addFileResult.isError))
    if (addFileResult.isError) {
      dispatch(showUploadProgress(false))
      dispatch(setFileInProgress(undefined))
    }
  }, [addFileResult.isError])

  useEffect(() => {
    if (!addFileResult.isUninitialized) {
      dispatch(showUploadProgress(true))
    }
  }, [addFileResult.isUninitialized])

  if (visible) {
    return (
        <div id='dragndrop' className='p-3 absolute w-full h-full left-0 top-0 bg-opacity-75 bg-zinc-200 z-40'>
          <DragNDropField className='w-full h-full' onDropFiles={setFiles}>
            <Text>Поле для файлов</Text>
          </DragNDropField>
        </div>
    )
  }
}