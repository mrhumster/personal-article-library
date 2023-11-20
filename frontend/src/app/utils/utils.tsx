import {AuthorIFace, PublicationDetails} from "../types";
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
  return <Text className={'cursor-pointer select-none'} size={'s'} fontStyle={'italic'} weight={'light'}>{content}</Text>
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
    <Text size={'s'} fontStyle={'italic'} weight={'light'}>
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