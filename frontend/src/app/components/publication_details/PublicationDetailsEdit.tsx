import React, {useEffect, useRef, useState} from "react";
import {Text} from "@consta/uikit/Text";

import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";
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
  const [title, setTitle] = useState<string | null>(null);
  const [volume, setVolume] = useState<string  | null>(null);
  const [issue, setIssue] = useState<string | null>(null);
  const [pageStart, setPageStart] = useState<string | null>(null);
  const [pageEnd, setPageEnd] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);


  const [updateArticle] = useUpdateArticleMutation()

  const publication = useSelector((state: RootState) => state.articles.current_article?.publication)
  const id = useSelector((state: RootState) => state.articles.current_article?.id)
  const article = useSelector((state: RootState) => state.articles.current_article)
  const reference_type = useSelector((state: RootState) => state.articles.current_article?.reference_type)
  const myRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (myRef.current && !myRef.current.contains(e.target as Node)) {
      setActive(false);
      const publication: PublicationDetails = {
        title: title,
        year: year,
        volume: volume,
        issue: issue,
        pages: {
          start: pageStart,
          end: pageEnd
        }
      }
      updateArticle({...article, publication: publication})
    }
  }

  const handleClickInside = () => setActive(true);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  useEffect(() => {
    if (publication) {
      setTitle(publication.title)
      setVolume(publication.volume)
      setYear(publication.year)
      setPageStart(publication.pages.start)
      setPageEnd(publication.pages.end)
      setIssue(publication.issue)
    }
  }, [id])

  return (
    <>
      {!active &&
          <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted py-1 mb-1"
                onClick={() => setActive(true)}>
            {publicationDetailToString(publication)}
          </Text>
      }
      {active &&
          <div className="border rounded border-sky-700 mb-1" ref={myRef} onClick={handleClickInside}>
              <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
                  <GridItem col={2}>
                      <TextField size={'s'}
                                 label={getTitleNameByReferenceType(reference_type)}
                                 placeholder={getTitleNameByReferenceType(reference_type)}
                                 onChange={setTitle}
                                 value={title}/>
                  </GridItem>
                  <GridItem>
                      <TextField size={'s'} label={'Год'} type={'number'} max={2100} min={1800} incrementButtons={false}
                                 placeholder={'Год публикации'}
                                 onChange={setYear}
                                 value={year}/>
                  </GridItem>
                  <GridItem className={'flex items-end'}>
                          <TextField size={'s'} className={'self-end me-1 w-24'} type={'number'} min={1} max={10000}
                                     incrementButtons={false} label={'Страницы'}
                                     onChange={setPageStart}
                                     value={pageStart}
                                     placeholder={'c'}
                          />
                          <TextField size={'s'} className={'self-end ms-1 w-24'} type={'number'} min={1} max={10000}
                                     incrementButtons={false}
                                     onChange={setPageEnd}
                                     value={pageEnd}
                                     placeholder={'по'}
                          />
                  </GridItem>
                  <GridItem col={1}>
                      <TextField size={'s'} label={'Том'}
                                 onChange={setVolume}
                                 value={volume}
                                 placeholder={'Номер тома'}
                      />
                  </GridItem>
                  <GridItem col={1}>
                      <TextField size={'s'} label={'Издание'}
                                 placeholder={'Введите издание'}
                                 onChange={setIssue}
                                 value={issue}/>
                  </GridItem>
              </Grid>
          </div>
      }
    </>
  )
}