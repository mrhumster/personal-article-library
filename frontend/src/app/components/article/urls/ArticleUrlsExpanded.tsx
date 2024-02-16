import React, {useEffect, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {Button} from "@consta/uikit/Button";
import { DatePicker } from '@consta/uikit/DatePicker';
import {IconAdd} from "@consta/icons/IconAdd";
import {IconClose} from "@consta/icons/IconClose";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {ArticleURLs} from "../../../types/article.types.ts";

interface ArticleUrlsExpandedPropsIFace {
  expandedRef : React.RefObject<HTMLDivElement>,
  datePickerRef : React.Ref<HTMLInputElement>,
  localCurrentUrls: ArticleURLs | undefined,
  setLocalCurrentUrls: React.Dispatch<React.SetStateAction<ArticleURLs | undefined>>
}

export const ArticleUrlsExpanded = (props: ArticleUrlsExpandedPropsIFace) => {
  const {
    expandedRef,
    datePickerRef,
    localCurrentUrls,
    setLocalCurrentUrls
  } = props

  const [urlError, setUrlError] = useState<{[key: number]:string}>({})
  const current_timezone = useSelector((state: RootState) => state.ui.timezone)


  useEffect(() => {
    if (!localCurrentUrls?.date_accessed) setLocalCurrentUrls(
      {
        urls: [''],
        date_accessed: moment().tz(current_timezone).format()
      }
    )
  }, [localCurrentUrls?.date_accessed])


  const handleClickAddURL = () => {
    setLocalCurrentUrls(prevState => {
      if (prevState) {
        return {
          ...prevState,
          urls: [...prevState.urls, '']
        }
      }
    })
  }

  const handleClickDeleteURL = (index: number) => {
    setLocalCurrentUrls(prevState => {
      if (prevState) {
        return {
          ...prevState,
          urls: prevState.urls.filter((item, i) => {if (i !== index) return item})
        }
      }
    })
  }


  const handleChangeUrl = (value: string | null, index: number) => {
    setLocalCurrentUrls(prevState => {
      if (prevState) {
        return {
          ...prevState,
          urls: prevState.urls.map((item, i) => {
            if (i === index) return value === null ? '' : value
            else return item
          })
        }
      }
    })
  }


  useEffect(() => {
    // Валидация URLs
    localCurrentUrls?.urls.map((url, index) => {
      if (url) {
        if (!/^(http|https):\/\//.test(url)) {
          setUrlError(prev => ({...prev, [index]: 'Рабочая ссылка должна начинаться с http(s)://'}))
        } else {
          setUrlError(prev => ({...prev, [index]: ''}))
        }
      }
    })
  }, [localCurrentUrls?.urls])

  const dateAccessedChangeHandler = (value: Date | null) => {
    setLocalCurrentUrls(prevState => {
      if (prevState && value) {
        return {
          ...prevState,
          date_accessed: value.toString()
        }
      }
    })
  }

  useEffect(() => {
    console.log(datePickerRef)
  }, [datePickerRef])

  return (
    <div ref={expandedRef} className={"border border-sky-700 rounded p-4"}>
      <DatePicker
        value={moment(localCurrentUrls?.date_accessed).toDate()}
        onChange={dateAccessedChangeHandler}
        ref={datePickerRef}
      />
      {localCurrentUrls?.urls.map((url, index) => (
        <div key={index} className={'relative'}>
          <TextField onChange={(value: string | null ) => handleChangeUrl(value, index)}
                     type={'url'}
                     className={'my-2'}
                     size={'s'}
                     label={`${index + 1}. URL`}
                     status={urlError[index] ? 'alert' : 'success'}
                     caption={urlError[index] ? urlError[index] : undefined}
                     value={url}
          />
          {index !== 0 &&
              <div className={'absolute top-0 right-0 mt-2'}>
                  <Button onlyIcon iconLeft={IconClose} view={'clear'} form={'round'} size={'xs'}
                          onClick={() => handleClickDeleteURL(index)}/>
              </div>
          }
        </div>
      ))}
      <Button
        className={'mt-2'}
        label={'Добавить еще один URL'}
        view={'clear'}
        size={'xs'}
        iconLeft={IconAdd}
        onClick={handleClickAddURL}
      />
    </div>
  )
}