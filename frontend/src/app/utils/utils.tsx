import React from "react";
import {AuthorIFace, PublicationDetails, VolumeIFace} from "../types";
import {Text} from "@consta/uikit/Text";
import {User} from "@consta/uikit/User";

export const authorsToString = (authors: AuthorIFace[] | null) => {
  let content
  if (authors) {
    const authorsList = authors?.map((author) => authorToString(author))
    content = authorsList?.map((author, index) => {
        if (author) {
          return (
          <User key={index}
                name={author}
                info={authorsList.length === 1 ? 'Автор' : 'Cоавтор'}
          />)
        } else {
          return <></>
        }
      }
    )
  } else {
    content = <span className="ms-1">Добавить информацию об авторе(ах)</span>
  }
  return <div className={'flex flex-wrap cursor-pointer'}>{content}</div>
}

export const authorToString = (author: AuthorIFace) => {
  if (author) {
    const {first_name, last_name, sur_name} = author
    return `${last_name !== null ? last_name : ''} ${first_name !== null ? first_name : ''} ${sur_name !== null ? sur_name : ''}`
  } else {
    return null
  }
}

export const publicationDetailToString = (details: PublicationDetails | undefined) => {
  if ( !details?.year) {
    return (
    <Text size={'s'} fontStyle={'italic'} weight={'light'}>
      <span className={'ms-1 cursor-pointer'}>Добавить информации о публикации</span>
    </Text>
    )
  }
  return (
    <Text size={'s'} fontStyle={'italic'} weight={'light'} className={'ms-1 cursor-pointer'}>
      {details.year && <span>({details.year})</span>}
      {details.pages?.start && details.pages?.end && <span>, {details.pages?.start} - {details.pages?.end}</span>}
      {details.volume && <span>, {details.volume}</span>}
    </Text>
  )
}

export const truncateString = (string = '', maxLength = 50) =>
  string.length > maxLength
    ? `${string.substring(0, maxLength)}…`
    : string


export const makeAuthorsList = (authorsList: string[]) => {
  const authors: AuthorIFace[] = []
  authorsList.map((a: string) => {
        const [last_name, first_name, sur_name] = a
          .replace(/\s+/g, ' ')
          .replace('Dr. ', '')
          .split(' ', 3)
        const author: AuthorIFace = {
          first_name: first_name,
          last_name: last_name,
          sur_name: sur_name
        }
        authors.push(author)
    })
  return authors
}


export const getISBNFromData = (type: 'ISBN_13' | 'ISBN_10', volume: VolumeIFace) => {
  let expected_identifier: string | undefined = undefined
  volume.volumeInfo.industryIdentifiers.forEach((ii: { type: string, identifier: string }) => {
    if (ii.type === type) expected_identifier = ii.identifier
  })
  return expected_identifier
}

export const getTitleNameByReferenceType = (reference_type: number | undefined) => {
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

export const copyTextToClipboard = async (text: string | string[]) => {
  if (typeof text === 'object') text = text.join('\n')
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}