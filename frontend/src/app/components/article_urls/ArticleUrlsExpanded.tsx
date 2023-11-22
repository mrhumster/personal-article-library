import React, {useEffect, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconClose} from "@consta/uikit/IconClose";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {RootState} from "../../store";


interface ArticleUrlsExpandedPropsIFace {
  expandedRef : React.RefObject<HTMLDivElement>,
  datePickerRef : React.RefObject<HTMLDivElement>
  dateAccessed: string | null,
  setDateAccessed: React.Dispatch<React.SetStateAction<string | null>>,
  urls: (string | null)[],
  setUrls: React.Dispatch<React.SetStateAction<(string | null)[]>>
}

export const ArticleUrlsExpanded = (props: ArticleUrlsExpandedPropsIFace) => {
  const {
    expandedRef,
    datePickerRef,
    dateAccessed,
    setDateAccessed,
    urls,
    setUrls
  } = props

  const [dateError, setDateError] = useState<string[]>([])
  const [urlError, setUrlError] = useState<{[key: number]:string}>({})

  const current_timezone = useSelector((state: RootState) => state.ui.timezone)

  const handleClickAddURL = () => {
    // Добавляет строчку с пустым URL
    setUrls(prev => [...prev, null])
  }

  const handleClickDeleteURL = (index: number) => {
    // Удаляет строчку с URL
    const mutateUrls = urls.filter((item, i) => {
      if (i !== index) return item
    })
    setUrls(mutateUrls)
  }


  const handleChangeUrl = (value: string | null, index: number) => {
    // Обновление локального состояния URLs
    const mutateUrls = urls.map((url, i) => {
      if (i === index) {
        return value
      } else {
        return url
      }
    })
    setUrls(mutateUrls)
  }

  useEffect(()=>{
    // Валидация даты посещения
    if (dateAccessed) {
      setDateError([])
      const d = moment.tz(dateAccessed, 'DD.MM.YYYY', current_timezone)
      if (!d.isValid()) {
        setDateError(prev => [...prev, 'Дата должна быть в формате ДД.ММ.ГГГГ'])
      }
      if (d.isSameOrAfter(moment(), 'hour')) {
        setDateError(prev => [...prev, 'Дата не может быть в будущем'])
      }
    }
  }, [dateAccessed])

  useEffect(() => {
    // Валидация URLs
    urls.map((url, index) => {
      if (url) {
        if (!/^(http|https):\/\//.test(url)) {
          setUrlError(prev => ({...prev, [index]: 'Рабочая ссылка должна начинаться с http(s)://'}))
        }
      }
    })
  }, [urls])

  return (
    <div ref={expandedRef} className={"border border-sky-700 rounded p-4"}>
      <TextField onChange={({value}) => setDateAccessed(value)}
                 label={'Дата доступа'}
                 placeholder={'ДД.ММ.ГГГГ'}
                 value={dateAccessed}
                 ref={datePickerRef}
                 status={dateError.length > 0 ? "alert" : "success"}
                 caption={dateError.length > 0 ? dateError.join('\n') : undefined}
                 width={'full'}
                 size={'s'}
      />
      {urls.map((url, index) => (
        <div key={index} className={'relative'}>
          <TextField onChange={({value}: { value: string | null }) => handleChangeUrl(value, index)}
                     type={'url'}
                     className={'my-2'}
                     size={'s'}
                     label={`${index + 1}. URL`}
                     status={urlError[index] ? 'alert' : 'success'}
                     caption={urlError[index] ? urlError[index] : undefined}
                     value={url}
                     width={'full'}
          />
          {index !== 0 &&
              <div className={'absolute top-0 right-0 mt-2'}>
                  <Button onlyIcon iconLeft={IconClose} view={'clear'} form={'round'} size={'xs'}
                          onClick={() => handleClickDeleteURL(index)}/>
              </div>
          }
        </div>
      ))}
      <Button className={'mt-2'} label={'Добавить еще один URL'} view={'clear'} size={'xs'} iconLeft={IconAdd}
              onClick={handleClickAddURL}/>
    </div>
  )
}