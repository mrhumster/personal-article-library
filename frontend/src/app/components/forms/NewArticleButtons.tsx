import React, {useEffect, useState} from "react";
import {Button} from "@consta/uikit/Button";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {formErrors} from "../../types";

export const NewArticleButtons = () => {
  const errors = useSelector((state: RootState) => state.ui.leftSideBar.formErrors)
  const [disabled, setDisabled] = useState<boolean>(false)

  function isEmpty(obj: formErrors) {
    const fields = ['title', 'authors']
    fields.map((field) => {
      if (obj[field]) {

      }
    })
  }

  useEffect(()=>{
    console.log(errors)

  }, [errors])

  return (
    <div className={'flex gap-3 p-3 mt-3 content-center'}>
        <Button view={'primary'} size={'s'} label={'Создать'} disabled={disabled}/>
        <Button view={'ghost'} size={'s'} label={'Отмена'}/>
      </div>
  )
}