import React from "react";
import {Text} from "@consta/uikit/Text"
import {NewArticleReferenceTypeSelect} from "./fields";
import {getFormByReferenceType} from './getFormByReferenceType.tsx'
import {NewArticleButtons} from "./NewArticleButtons.tsx";

export const NewArticleForm = () => {
  const FormByReferenceType = getFormByReferenceType()
  return (
    <div className='ms-16 p-3 flex flex-col h-full'>
      <Text className={'ms-5 mt-2 mb-5'} align={'left'} size={'l'} weight={'light'}>Создать новую ссылку</Text>
      <div className={'grow overflow-y-auto'}>
        <NewArticleReferenceTypeSelect />
        {FormByReferenceType}
      </div>
      <NewArticleButtons />
    </div>
  )
}