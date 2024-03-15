import React from "react";
import {Text} from "@consta/uikit/Text"
import {NewArticleReferenceTypeSelect} from "./fields";
import {getFormByReferenceType} from './getFormByReferenceType.tsx'

export const NewArticleForm = () => {
  const FormByReferenceType = getFormByReferenceType()
  return (
    <div className='ms-16 p-3 grid grid-col-1 gap-4'>
      <Text className={'ms-5 mt-3'} align={'left'} size={'l'} weight={'light'}>Создать новую ссылку</Text>
      <NewArticleReferenceTypeSelect />
      {FormByReferenceType}
    </div>
  )
}