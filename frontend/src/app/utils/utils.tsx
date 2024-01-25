import {AuthorIFace, PublicationDetails, VolumeIFace} from "../types";
import {Text} from "@consta/uikit/Text";
import React from "react";

export const authorsToString = (authors: AuthorIFace[] | null) => {
  let content
  if (authors && authors.length > 0) {
    const authorsList = authors?.map(
      ({first_name, last_name}) => `${last_name} ${first_name ? `${first_name[0]}.` : ''}`)
    content = authorsList?.map((author, index) => <span key={index} className="inline-block mx-1">{author}</span>)
  } else {
    content = <span className="ms-1">Добавить информацию об авторе(ах)</span>
  }
  return <Text className={'cursor-pointer select-none'} size={'xs'} weight={'regular'}>{content}</Text>
}

export const publicationDetailToString = (details: PublicationDetails | undefined) => {
  if ( !details?.year) {
    return (
    <Text size={'s'} fontStyle={'italic'} weight={'light'}>
      <span className={'ms-1 cursor-pointer select-none'}>Добавить информации о публикации</span>
    </Text>
    )
  }
  return (
    <Text size={'s'} fontStyle={'italic'} weight={'light'} className={'ms-1 cursor-pointer select-none'}>
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
