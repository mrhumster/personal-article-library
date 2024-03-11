import React from "react";
import {useUpdateArticleMutation} from "../../../services/backend";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {AuthorIFace} from "../../../types";
import {ISBNExtraRow} from "./ISBNExtraRow.tsx";
import {ISBNExtraThumbnail} from "./ISBNExtraThumbnail.tsx";
import {getISBNFromData, makeAuthorsList} from "../../../utils";
import {VolumeIFace} from "../../../types";
import moment from "moment";


interface ISBNExtraPropsIFace {
  volumeItem: VolumeIFace
}


export const ISBNExtra = (props: ISBNExtraPropsIFace) => {
  const { volumeItem } = props
  const [updateArticle] = useUpdateArticleMutation()
  const current_article = useSelector((state: RootState) => state.articles.current_article)

  const handleClickCopyTitle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await updateArticle({...current_article, title: volumeItem.volumeInfo.title, publication: {...current_article?.publication, ...{title: volumeItem.volumeInfo.title}}, reference_type: '1'})
  }

  const handleClickCopyAuthors = async (e: React.MouseEvent)=> {
    e.stopPropagation()
    const authors: AuthorIFace[] = makeAuthorsList(volumeItem.volumeInfo.authors)
    await updateArticle({...current_article, authors: authors, reference_type: '1'})
  }

  const handleClickCopyPublisher = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await updateArticle({...current_article, additional_information: {...current_article?.additional_information, ...{publisher: volumeItem.volumeInfo.publisher}}, reference_type: '1'
    })
  }

  const handleClickCopyPages = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await updateArticle(
      {...current_article,
        publication: {...current_article?.publication, pages:
            {...current_article?.publication?.pages, end: volumeItem.volumeInfo.pageCount.toString()}}})
  }

  const handleClickCopyPublishedDate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const date = new Date(volumeItem.volumeInfo.publishedDate)
    await updateArticle({...current_article, publication: {...current_article?.publication, ...{year: date.getFullYear()}},
      additional_information: {...current_article?.additional_information, ...{month: date.getMonth() + 1}, ...{day: date.getDay()}},
      reference_type: '1'
    })
  }

  const handleClickCopyDescription = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await updateArticle({...current_article, description: volumeItem.volumeInfo.description})
  }

  return (
    <div className='border border-dotted rounded bg-zinc-100'>
      <ISBNExtraThumbnail imageLinks={volumeItem.volumeInfo.imageLinks} />
      <div className='grid grid-cols-[25%_55%_20%] gap-1 text-sm py-1 ps-1 pb-1'>
        <ISBNExtraRow label='Название' content={volumeItem.volumeInfo.title} callback={handleClickCopyTitle}/>
        <ISBNExtraRow label='Автор(ы)' content={volumeItem.volumeInfo.authors} callback={handleClickCopyAuthors}/>
        <ISBNExtraRow label='Описание' content={volumeItem.volumeInfo.description} callback={handleClickCopyDescription}/>
        <ISBNExtraRow label='Издатель' content={volumeItem.volumeInfo.publisher} callback={handleClickCopyPublisher}/>
        <ISBNExtraRow label='Дата публикации'
                      content={moment(new Date(volumeItem.volumeInfo.publishedDate)).format('DD.MM.YYYY')}
                      callback={handleClickCopyPublishedDate}/>
        <ISBNExtraRow label='Количество страниц' content={volumeItem.volumeInfo.pageCount && volumeItem.volumeInfo.pageCount.toString()} callback={handleClickCopyPages}/>
        <ISBNExtraRow label='Категория' content={volumeItem.volumeInfo.categories}/>
        <ISBNExtraRow label='Язык' content={volumeItem.volumeInfo.language}/>
        <ISBNExtraRow label='ISBN 13' content={getISBNFromData('ISBN_13', volumeItem)}/>
        <ISBNExtraRow label='ISBN 10' content={getISBNFromData('ISBN_10', volumeItem)}/>
      </div>
    </div>
  )
}