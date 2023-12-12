import React, {useEffect, useRef, useState} from "react";
import {Text} from "@consta/uikit/Text";

import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDebounce} from "@consta/uikit/useDebounce";
import {PublicationDetails} from "../../types";
import {useUpdateArticleMutation} from "../../services/backend";
import {publicationDetailToString} from "../../utils";


const getTitleNameByReferenceType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return 'Название'
    case 1:
      return 'Название книги'
    case 2:
      return 'Название журнала'
    case 3:
      return 'Название статьи (источника)'
    case 4:
      return 'Название газеты'
    case 5:
      return 'Название нормативного акта'
    case 6:
      return 'Название сборника'
    case 7:
      return 'Название (тема)'
    case 8:
      return 'Название документа'
    case undefined:
      return 'Название'
  }
}

export const PublicationDetailsEdit = () => {
  const [active, setActive] = useState<boolean>(false)

  const [title, setTitle] = useState<string | undefined>(undefined);
  const handleChangeTitle = (value: string | undefined ) => setTitle(value);

  const [volume, setVolume] = useState<string  | undefined>(undefined);
  const handleChangeVolume = (value : string | undefined ) => setVolume(value);

  const [issue, setIssue] = useState<string | undefined>(undefined);
  const handleChangeIssue = (value: string | undefined ) => setIssue(value);

  const [pageStart, setPageStart] = useState<string | undefined>(undefined);
  const handleChangePageStart = (value : string | undefined ) => setPageStart(value);

  const [pageEnd, setPageEnd] = useState<string | undefined>(undefined);
  const handleChangePageEnd = (value : string | undefined ) => setPageEnd(value);

  const [year, setYear] = useState<string | undefined>(undefined);
  const handleChangeYear = (value: string | undefined ) => setYear(value);

  const [updateArticle] = useUpdateArticleMutation()

  const handleChange = (publication: PublicationDetails) => {
    updateArticle({id: id, publication: publication})
  }

  const debouncedSetValue = useDebounce(handleChange, 300)

  const pubDetails = useSelector((state: RootState) => state.articles.current_article?.publication)
  const id = useSelector((state: RootState) => state.articles.current_article?.id)
  const reference_type = useSelector((state: RootState) => state.articles.current_article?.reference_type)
  const myRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (myRef.current) {
      if (!myRef.current.contains(e.target as Node)) {
        setActive(false);
        debouncedSetValue({
          title: title,
          year: year,
          pages: {
            start: pageStart,
            end: pageEnd,
          },
          volume: volume
        })
      }
    }
  }

  const handleClickInside = () => setActive(true);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  useEffect(() => {
    if (pubDetails) {
      setTitle(pubDetails?.title)
      setVolume(pubDetails?.volume)
      setYear(pubDetails?.year)
      setPageStart(pubDetails?.pages?.start)
      setPageEnd(pubDetails?.pages?.end)
    }
  }, [pubDetails])

  return (
    <>
      {!active &&
          <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted py-1 mb-1"
                onClick={() => setActive(true)}>
            {publicationDetailToString(pubDetails)}
          </Text>
      }
      {active &&
          <div className="border rounded border-sky-700 mb-1" ref={myRef} onClick={handleClickInside}>
              <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
                  <GridItem col={2}>
                      <TextField size={'s'} width={'full'} label={getTitleNameByReferenceType(reference_type)}
                                 placeholder={getTitleNameByReferenceType(reference_type)}
                                 onChange={({value}:{value: string | null})=> handleChangeTitle(value? value : undefined)} value={title}/>
                  </GridItem>
                  <GridItem>
                      <TextField size={'s'} label={'Год'} type={'number'} max={2100} min={1800} incrementButtons={false}
                                 placeholder={'Год публикации'}
                                 width={'full'}
                                 onChange={({value}:{value: string | null})=> handleChangeYear(value? value : undefined)} value={year}/>
                  </GridItem>
                  <GridItem className={'flex items-end'}>
                          <TextField size={'s'} className={'self-end me-1 w-24'} type={'number'} min={1} max={10000}
                                     incrementButtons={false} label={'Страницы'}
                                     onChange={({value}:{value: string | null})=> handleChangePageStart(value? value : undefined)}
                                     value={pageStart}
                                     placeholder={'c'}
                          />
                          <TextField size={'s'} className={'self-end ms-1 w-24'} type={'number'} min={1} max={10000}
                                     incrementButtons={false}
                                     onChange={({value}:{value: string | null})=> handleChangePageEnd(value? value : undefined)}
                                     value={pageEnd}
                                     placeholder={'по'}
                          />
                  </GridItem>
                  <GridItem col={1}>
                      <TextField size={'s'} width={'full'} label={'Том'}
                                 onChange={({value}:{value: string | null})=> handleChangeVolume(value? value : undefined)}
                                 value={volume}
                                 placeholder={'Номер тома'}
                      />
                  </GridItem>
                  <GridItem col={1}>
                      <TextField size={'s'} width={'full'} label={'Издание'}
                                 placeholder={'Введите издание'}
                                 onChange={({value}:{value: string | null})=> handleChangeIssue(value? value : undefined)}
                                 value={issue}/>
                  </GridItem>
              </Grid>
          </div>
      }
    </>
  )
}