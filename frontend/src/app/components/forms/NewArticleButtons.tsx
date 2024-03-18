import React, {useEffect, useState} from "react";
import {Button} from "@consta/uikit/Button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {closeLeftSideBar} from "../../features/ui";
import {useCreateArticleMutation} from "../../services/backend";
import {addArticle} from "../../features/article";

export const NewArticleButtons = () => {
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors)
  const new_article = useSelector((state: RootState) => state.articles.new_article)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [createArticle, {isSuccess, data}] = useCreateArticleMutation()
  const dispatch = useDispatch()

  function isEmpty(errors: { [key: string]: string[][] }) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        if (errors[key].length > 0) {
          if (errors[key][0].length > 0) {
            return false
          }
        }
      }
    }
    return true
  }

  useEffect(()=>{
    if (isEmpty(errors)) setDisabled(false)
    else setDisabled(true)
  }, [errors])

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(addArticle(data))
      dispatch(closeLeftSideBar())
    }
  }, [isSuccess, data])

  const handleCancel = () => {
    dispatch(closeLeftSideBar())
  }

  const handleSubmit = () => {
    createArticle(new_article)
  }

  return (
    <div className={'flex gap-3 p-3 mt-3 content-center'}>
        <Button view={'primary'} size={'s'} label={'Создать'} disabled={disabled} onClick={handleSubmit}/>
        <Button view={'ghost'} size={'s'} label={'Отмена'} onClick={handleCancel}/>
      </div>
  )
}