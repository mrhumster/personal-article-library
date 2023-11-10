import React, {useEffect, useRef, useState} from "react";
import {Text} from "@consta/uikit/Text";
import {publicationDetailToString} from "../main";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
import {useDebounce} from "@consta/uikit/useDebounce";
import {PublicationDetails} from "../../types";
import {useUpdateArticleMutation} from "../../services/backend";


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

  const [title, setTitle] = useState<string | null | undefined>(null);
  const handleChangeTitle = ({ value }: { value: string | null }) => setTitle(value);

  const [volume, setVolume] = useState<string | null | undefined>(null);
  const handleChangeVolume = ({ value }: { value: string | null }) => setVolume(value);

  const [issue, setIssue] = useState<string | null | undefined>(null);
  const handleChangeIssue = ({ value }: { value: string | null }) => setIssue(value);

  const [pageStart, setPageStart] = useState<number | null | undefined>(null);
  const handleChangePageStart = ({ value }: { value: number | null }) => setPageStart(value);

  const [pageEnd, setPageEnd] = useState<number | null | undefined>(null);
  const handleChangePageEnd = ({ value }: { value: number | null }) => setPageEnd(value);

  const [year, setYear] = useState<number | null | undefined>(null);
  const handleChangeYear = ({ value }: { value: number | null }) => setYear(value);

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
          <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted py-1"
                onClick={() => setActive(true)}>
            {publicationDetailToString(pubDetails)}
          </Text>
      }
      {active &&
          <div className="border rounded border-sky-700" ref={myRef} onClick={handleClickInside}>
              <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
                  <GridItem col={2}>
                      <TextField size={'s'} width={'full'} label={getTitleNameByReferenceType(reference_type)} onChange={handleChangeTitle} value={title}/>
                  </GridItem>
                  <GridItem>
                      <TextField size={'s'} label={'Год'} type={'number'} max={2100} min={1800} incrementButtons={false} onChange={handleChangeYear} value={year}/>
                  </GridItem>
                  <GridItem className={'flex items-end'}>
                          <TextField size={'s'} className={'self-end me-1 w-24'} type={'number'} min={1} max={10000} incrementButtons={false} label={'Страницы'} onChange={handleChangePageStart} value={pageStart}/>
                          <TextField size={'s'} className={'self-end ms-1 w-24'} type={'number'} min={1} max={10000} incrementButtons={false} onChange={handleChangePageEnd} value={pageEnd}/>
                  </GridItem>
                  <GridItem col={1}>
                      <TextField size={'s'} width={'full'} label={'Том'} onChange={handleChangeVolume} value={volume}/>
                  </GridItem>
                  <GridItem col={1}>
                      <TextField size={'s'} width={'full'} label={'Выпуск'} onChange={handleChangeIssue} value={issue}/>
                  </GridItem>
              </Grid>
          </div>
      }
    </>
  )
}