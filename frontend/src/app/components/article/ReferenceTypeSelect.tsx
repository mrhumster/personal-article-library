import React from 'react';
import { Combobox } from '@consta/uikit/ComboboxCanary';
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";

type ReferenceTypeItem = {
  label: string;
  id: number;
};

const items: ReferenceTypeItem[] = [
  {
    label: 'Не классифицировано',
    id: 0,
  },
  {
    label: 'Книга',
    id: 1,
  },
  {
    label: 'Журнал',
    id: 2
  },
];


export const ReferenceTypeSelect = () => {
  const article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()
  const handleChange = (value: ReferenceTypeItem) => {
    updateArticle({id: article?.id, reference_type: value.id})
  }
    return (
      <Combobox
        placeholder="Выберите вариант"
        items={items}
        value={items[article?.reference_type ? article?.reference_type : 0]}
        onChange={handleChange}
        size={'s'}
        view={'clear'}
      />
    )
}