import {FileField} from "@consta/uikit/FileField";
import React, {ChangeEvent, ReactNode, useEffect} from "react";
import {
  useAddFileMutation,
  useCreateArticleMutation,
  useGetArticleQuery, useGetArticlesQuery, useUpdateArticleMutation
} from "../../services/backend";
import {useDispatch} from "react-redux";
import {setError, setFileInProgress, setLoading, setSuccess, showUploadProgress} from "../../features/ui";
import {filesize} from "filesize";
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/ru';
import {CreateArticleIFace} from "../../types";
import {addFileInCurrentArticle, setCurrentArticle} from "../../features/article";

moment().locale('ru')

export const AddNewFileButton = ({ text, article }:{text: ReactNode, article?: string}) => {
  const [addFile, addFileResult] = useAddFileMutation()
  const [addArticle, isSuccess] = useCreateArticleMutation()
  const getArticles = useGetArticlesQuery({})
  const { data } = useGetArticleQuery(article, {skip: !article})

  const dispatch = useDispatch()

  const handleChange = (event: DragEvent | ChangeEvent<Element>) => {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const form_data = new FormData()
    form_data.append('attach', file)
    addFile(form_data)
    const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2)
    dispatch(setFileInProgress({
        name: file.name,
        extension: extension,
        description: `${extension} | ${filesize(file.size, {standard: "jedec"})} | ${moment(file.lastModified).format('DD MMMM YYYY')}`
      }))
  }

  useEffect(() => {if (isSuccess) {getArticles.refetch()}}, [isSuccess])

  useEffect(() => {
    if (addFileResult.data) {
      const newArticle: CreateArticleIFace = {
        title: addFileResult.data.file_name,
        files: [addFileResult.data.id]
      }
      if (article) {
        console.log('***',article, '***')
        dispatch(addFileInCurrentArticle(addFileResult.data.id))
      } else {
        addArticle(newArticle)
      }
    }
  }, [addFileResult.isSuccess, addFileResult.data])

  useEffect(() => {
    dispatch(setLoading(addFileResult.isLoading))
  }, [addFileResult.isLoading])

  useEffect(()=> {
    dispatch(setSuccess(addFileResult.isSuccess))
    // refetch()
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

  return (
  <>
    <FileField id="addFileDialog" onChange={handleChange}>
      {text}
    </FileField>
  </>
  )
}