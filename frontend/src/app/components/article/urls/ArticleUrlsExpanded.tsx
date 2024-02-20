import React, {memo, useEffect, useState} from "react";
import { ReactMaskOpts, useIMask } from 'react-imask';
import {TextField} from "@consta/uikit/TextField";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/icons/IconAdd";
import {IconClose} from "@consta/icons/IconClose";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {IconLightningBolt} from "@consta/icons/IconLightningBolt";
import {IconLink} from "@consta/icons/IconLink";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {ArticleURLs} from "../../../types/article.types.ts";

interface ArticleUrlsExpandedPropsIFace {
  expandedRef : React.RefObject<HTMLDivElement>,
  datePickerRef : React.Ref<HTMLInputElement>,
  localCurrentUrls: ArticleURLs | undefined,
  setLocalCurrentUrls: React.Dispatch<React.SetStateAction<ArticleURLs | undefined>>
  dateString: string | undefined | null,
  setDateString: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

const TextFieldMemo = memo(TextField);

export const ArticleUrlsExpanded = (props: ArticleUrlsExpandedPropsIFace) => {
  const {
    expandedRef,
    datePickerRef,
    localCurrentUrls,
    setLocalCurrentUrls,
    dateString,
    setDateString
  } = props

  const [urlError, setUrlError] = useState<{[key: number]:string}>({})
  const [dateStringErrors, setDateStringErrors] = useState<string[]>([])
  const current_timezone = useSelector((state: RootState) => state.ui.timezone)

  const { ref, value} = useIMask<HTMLInputElement, ReactMaskOpts>({mask: '00.00.0000',});

  useEffect(() => {
    setDateString(value)
  }, [value])

  useEffect(() => {
    if (!localCurrentUrls?.date_accessed) setLocalCurrentUrls(
      {
        urls: [''],
        date_accessed: moment.tz(current_timezone).toISOString()
      }
    )
  }, [localCurrentUrls?.date_accessed])

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

  const addError = (error: string) => {
    setDateStringErrors(prevState => {
        if (prevState.includes(error)) {
          return prevState
        } else {
          return [...prevState, error]
        }
      })
  }

  const removeError = (error: string) => {
    setDateStringErrors(prevState => prevState.filter(value => value !== error))
  }

  useEffect(() => {
    const error1 = 'Не верная формат даты'
    const error2 = 'Дата не может быть в будущем'
    if (moment(dateString, 'DD.MM.YYYY').isValid()) removeError(error1)
    else addError(error1)
    if (moment(dateString, 'DD.MM.YYYY').isBefore(moment())) removeError(error2)
    else addError(error2)
  }, [dateString])


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

  return (
    <div ref={expandedRef} className={"border border-sky-700 rounded p-4"}>
      <div className='flex items-stretch'>
        <TextFieldMemo
          value={dateString}
          onChange={setDateString}
          ref={datePickerRef}
          placeholder={'ДД.ММ.ГГГГ'}
          leftSide={IconCalendar}
          size={'s'}
          inputRef={ref}
          form={'defaultBrick'}
          status={dateStringErrors.length > 0 ? 'alert' : 'success'}
          label={'Дата посещения'}
          caption={dateStringErrors.join('\n')}
        />
        <Button
          className={'mt-[25px]'}
          onlyIcon
          iconLeft={IconLightningBolt}
          form={'brickDefault'}
          size={"s"}
          view={'secondary'}
          title={'Сегодня'}
          onClick={() => setDateString(moment().format('DD.MM.YYYY'))}
        />
      </div>
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
                     leftSide={IconLink}
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