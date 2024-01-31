import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useDebounce} from "@consta/uikit/useDebounce";
import {TextField} from "@consta/uikit/TextField";
import {GridItem} from "@consta/uikit/Grid";

import {RootState} from "../../../store";
import {EditorsIFace} from "../../../types";
import {setAdditionalInformation} from "../../../features/article";

export const EditorsField = () => {
  const editors = useSelector((state: RootState) => state.articles.current_article?.additional_information?.editors)
  const [value, setValue] = useState<string | null>(null)
  const dispatch = useDispatch()

  const handleChange = () => {
    const editorsList = value?.split('\n')
    const editors: EditorsIFace[] = []
    if (editorsList) {
      editorsList.map((name) => {
        if (name.length > 1) {
          const [last_name, first_name, sur_name] = name.replace(/\s+/g, ' ').split(' ', 3)
          const editor: EditorsIFace = {
            first_name: first_name,
            last_name: last_name,
            sur_name: sur_name
          }
          editors.push(editor)
        }
      })
    }
    dispatch(setAdditionalInformation({editors: editors}))
  }

  const debouncedSetValue = useDebounce(handleChange, 300)

  useEffect(()=> {
    if (editors) {
      const a = editors.map(({ last_name, first_name, sur_name}) => `${last_name} ${first_name} ${sur_name}`)
      setValue(a.join('\n'))
    }
  }, [])

  useEffect(() => {
    debouncedSetValue()
  }, [value])

  return (
    <GridItem col={2}>
      <TextField
          size={'s'}
          type={'textarea'}
          minRows={1}
          maxRows={5}
          value={value}
          label={'Редактор(ы)'}
          caption={'Фамилия Имя и Отчество. Редакторов разделяйте новой строкой.'}
          onChange={setValue}
        />
    </GridItem>
  )
}