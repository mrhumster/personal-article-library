import React from 'react';
import { Combobox } from '@consta/uikit/Combobox';
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {ReferenceTypeItem} from "../../types";
import {ReferenceTypeItems} from "../../items/reference_type.items.ts";
import {FavoriteCell} from "../main/table_cells";

export const ReferenceTypeSelect = () => {
  const article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()

  const handleChange = (value: ReferenceTypeItem | null) => {
    updateArticle({...article, reference_type: value?.id})
  }
    return (
      <div className='w-size flex items-stretch'>
        <Combobox
          placeholder="Выберите вариант"
          items={ReferenceTypeItems}
          value={ReferenceTypeItems[article?.reference_type ? article?.reference_type : 0]}
          onChange={handleChange}
          size={'s'}
          view={'default'}
        />
        <FavoriteCell article={article} size={'m'}/>
      </div>
    )
}