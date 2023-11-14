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
import {useAddArticleFileMutation} from "../../services/backend";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";

export const DragLayout = () => {
  const visible = useSelector((state: RootState) => state.ui.dragndrop.activeAllReferenceDragNDropField)
  const [files, setFiles] = React.useState<File[]>();

  const [
    addArticleFile,
    { isUninitialized,
      isLoading,
      isError,
      isSuccess
    }] = useAddArticleFileMutation()
  const dispatch = useDispatch()

  useEffect(()=>{
    if (files) {
      const file = files[0]
      const form_data = new FormData()
      form_data.append('attach', file)
      addArticleFile(form_data)
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
    dispatch(setLoading(isLoading))
  }, [isLoading])

  useEffect(()=> {
    dispatch(setSuccess(isSuccess))
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

  if (visible) {
    return (
        <div id='dragndrop' className='p-3 absolute w-full h-full left-0 top-0 bg-opacity-75 bg-zinc-200 z-40'>
          <DragNDropField className='w-full h-full' onDropFiles={setFiles}>
            <Text>Здесь просто текст</Text>
          </DragNDropField>
        </div>
    )
  }
}