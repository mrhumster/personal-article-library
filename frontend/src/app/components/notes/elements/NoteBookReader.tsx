import React, {useEffect, useState} from "react";
import {useGetNoteBookQuery, useUpdateNoteBookMutation} from "../../../services/backend";
import {NoteBookIFace} from "../../../types";
import {IconArrowLeft} from "@consta/icons/IconArrowLeft"
import {Button} from "@consta/uikit/Button";
import {setActiveNotebook} from "../../../features/ui";
import {useDispatch, useSelector} from "react-redux";
import {SkeletonText} from "@consta/uikit/Skeleton";
import {TextField} from "@consta/uikit/TextField";
import {useDebounce} from "@consta/uikit/useDebounce";
import {RootState} from "../../../store";
import moment from "moment";

interface NoteBookReaderIFace {
  id?: string
}

interface formErrors {
  [key:string] : string[]
}

export const NoteBookReader = ({ id }: NoteBookReaderIFace) => {
  const {data, isLoading, isSuccess} = useGetNoteBookQuery(id, {skip: !id})
  const [notebook, setNotebook] = useState<NoteBookIFace | undefined>(undefined)
  const [errors, setErrors] = useState<formErrors | undefined>(undefined)
  const [updateNoteBook] = useUpdateNoteBookMutation()
  const debounceUpdate = useDebounce(updateNoteBook, 300)
  const current_timezone = useSelector((state: RootState) => state.ui.timezone)
  const dispatch = useDispatch()


  useEffect(()=> { if (data) setNotebook(data) }, [data])

  const clickHandler = () => dispatch(setActiveNotebook(undefined))

  const titleChangeHandler = (value : string | null ) => {
    if (value && value.length > 500 && value.length < 1 || !value) {
      setErrors(prevState => {
        return {
          ...prevState,
          'title': ['Заголовок не меньше 1 и не больше 500 символов']
        }
      })
    } else {
      setErrors(prevState => {
        return {
          ...prevState,
          'title': []
        }
      })
    }
    setNotebook(prevState => {
      if (prevState) {
        return {
          ...prevState,
          title: value,
          changed: moment.tz(current_timezone).format()
        }
      }
    })
  }

  useEffect(() => {debounceUpdate(notebook)}, [notebook])

  const bodyChangeHandler = (value : string | null ) => {
    setNotebook(prevState => {
      if (prevState) {
        return {
          ...prevState,
          body: value,
          changed: moment.tz(current_timezone).format()
        }
      }
    })
  }

  return (
    <div className='flex flex-col p-3'>
      <Button label='Вернуться ко списку страниц'
              view='clear'
              size='s'
              iconLeft={IconArrowLeft}
              onClick={clickHandler}
              disabled={!!((errors && errors.title && errors.title.length > 0) || (errors && errors.body && errors.body.length > 0))}
      />
      { isLoading &&
        <>
          <SkeletonText className={'my-3'} rows={1} fontSize={'2xl'} />
          <SkeletonText rows={4} fontSize={'m'} />
        </>
      }
      { isSuccess &&
        <>
          <TextField className='py-1'
                     size='l'
                     placeholder='Название вашей страницы...'
                     view='clear'
                     value={notebook?.title}
                     onChange={titleChangeHandler}
                     required
                     status={errors && errors.title.length > 0 ? 'alert' : undefined}
                     caption={errors && errors.title ? errors.title.join('\n') : ''}
          />
          <TextField size='m'
                     view='clear'
                     type='textarea'
                     minRows={20}
                     placeholder='Начните печатать...'
                     value={notebook?.body}
                     onChange={bodyChangeHandler} />
        </>
      }
    </div>
  )
}