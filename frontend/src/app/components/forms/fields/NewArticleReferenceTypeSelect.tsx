import React from 'react';
import { Combobox } from '@consta/uikit/Combobox';
import {useDispatch, useSelector} from "react-redux";
import {ReferenceTypeItem} from "../../../types";
import {RootState} from "../../../store";
import {ReferenceTypeItems} from "../../../items/reference_type.items";
import {setNewArticleReferenceType} from "../../../features/article";

export const NewArticleReferenceTypeSelect = () => {
  const article = useSelector((state: RootState) => state.articles.new_article)
  const dispatch = useDispatch()

  const handleChange = (value: ReferenceTypeItem | null) => {
    if (value) dispatch(setNewArticleReferenceType(value.id))
  }
    return (
      <div className='w-size flex items-stretch px-3'>
        <Combobox
          placeholder="Выберите вариант"
          items={ReferenceTypeItems}
          value={ReferenceTypeItems[article?.reference_type ? article?.reference_type : 0]}
          onChange={handleChange}
          size={'s'}
          view={'default'}
        />
      </div>
    )
}