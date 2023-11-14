import {FileField} from "@consta/uikit/FileField";
import React, {ChangeEvent, ReactNode, useEffect} from "react";
import {useAddArticleFileMutation, useGetArticleQuery} from "../../services/backend";
import {useDispatch} from "react-redux";
import {setError, setFileInProgress, setLoading, setSuccess, showUploadProgress} from "../../features/ui";
import {filesize} from "filesize";
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/ru';

moment().locale('ru')

export const AddNewFileButton = ({ text, article }:{text: ReactNode, article?: string}) => {
  const [
    addArticleFile,
    { isUninitialized,
      isLoading,
      isError,
      isSuccess
    }] = useAddArticleFileMutation()

  const { refetch } = useGetArticleQuery(article)

  const dispatch = useDispatch()

  const handleChange = (event: DragEvent | ChangeEvent<Element>) => {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const form_data = new FormData()
    form_data.append('attach', file)
    if (article) { form_data.append('article', article)}
    addArticleFile(form_data)
    const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2)
    dispatch(setFileInProgress({
        name: file.name,
        extension: extension,
        description: `${extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.lastModified).format('DD MMMM YYYY')}`
      }))
  }


  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [isLoading])

  useEffect(()=> {
    dispatch(setSuccess(isSuccess))
    refetch()
  }, [isSuccess])

  useEffect(() => {
    dispatch(setError(isError))
    if (isError) {
      dispatch(showUploadProgress(false))
      dispatch(setFileInProgress(undefined))
    }
  }, [isError])

  useEffect(() => {
    if (!isUninitialized) {
      dispatch(showUploadProgress(true))
    }
  }, [isUninitialized])

  return (
  <>
    <FileField id="addFileDialog" onChange={handleChange}>
      {text}
    </FileField>
  </>
  )
}