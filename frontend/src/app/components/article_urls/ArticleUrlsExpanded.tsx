import React from "react";
import {TextField, useIMask} from "@consta/uikit/TextField";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconClose} from "@consta/uikit/IconClose";


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

  const { inputRef } = useIMask({
    dateAccessed,
    onChange: setDateAccessed,
    maskOptions: '00.00.0000',
  });

  return (
    <div ref={expandedRef} className={"border border-sky-700 rounded p-4"}>
      <TextField onChange={({value}) => setDateAccessed(value)}
                 inputRef={inputRef}
                 placeholder={'ДД.ММ.ГГГГ'}
                 label={'Дата доступа'}
                 value={dateAccessed}
                 width={'full'}
                 size={'s'}
      />
      {urls.map((url, index) => (
        <div key={index} className={'relative'}>
          <TextField onChange={({value}: { value: string | null }) => handleChangeUrl(value, index)}
                     className={'my-2'}
                     size={'s'}
                     label={`${index + 1}. URL`}
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