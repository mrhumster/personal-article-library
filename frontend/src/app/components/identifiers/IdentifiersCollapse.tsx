import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Button} from "@consta/uikit/Button";
import {useGetMetaQuery} from "../../services/backend";
import {IconLightningBolt} from "@consta/uikit/IconLightningBolt";
import {IconArrowDown} from "@consta/icons/IconArrowDown";
import {IconArrowUp} from "@consta/icons/IconArrowUp";

export const IdentifiersCollapse = ({setIsExpanded}:{setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const identifiers = useSelector((state: RootState) => state.articles.current_article?.identifiers)
  const isbn = identifiers?.isbn.isbn13
  const {data, error, isLoading, isSuccess} = useGetMetaQuery(isbn, {skip: !isbn})

  const [showMeta, setShowMeta] = useState<boolean>(false)

  const handleClickISBN = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    setShowMeta(!showMeta)
  }
  return (
    <div className={"cursor-pointer border border-dotted border-transparent hover:border-sky-700 rounded p-1"}
         onClick={() => setIsExpanded(true)}>
      {identifiers?.isbn.isbn13 &&
          <>
              <div className='grid grid-cols-[25%_55%_20%] gap-2 text-sm py-1 ps-1 text-m pb-3'>

                  <div className='my-auto text-slate-500'>ISBN 13:</div>
                  <div className='my-auto'>{identifiers?.isbn.isbn13}</div>
                  <Button className='ms-auto me-4'
                          loading={isLoading}
                          disabled={!!error}
                          iconLeft={showMeta ? IconArrowUp : IconArrowDown}
                          size='s'
                          view='clear'
                          form='round'
                          onClick={handleClickISBN}
                          title='Показать данные найденные по ISBN'/>

              </div>
            {showMeta && isSuccess &&
                <div className='border border-dotted rounded bg-zinc-100'>
                  { data.items[0].volumeInfo.imageLinks && <img className='w-32 ms-auto me-auto mt-2 mb-2' src={data.items[0].volumeInfo.imageLinks.thumbnail}
                         alt='Thumbnail'/>
                  }
                    <div className='grid grid-cols-[25%_55%_20%] gap-1 text-sm py-1 ps-1 text-m pb-1'>
                        <div className='my-auto text-slate-500'>Название</div>
                        <div className="my-auto">{data.items[0].volumeInfo.title}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>

                        <div className='my-auto text-slate-500'>Автор(ы)</div>
                        <div className="my-auto">{data.items[0].volumeInfo.authors.map((a: string, i: number) => <div
                          key={i}>{a}</div>)}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>

                        <div className='my-auto text-slate-500'>Издатель</div>
                        <div className="my-auto">{data.items[0].volumeInfo.publisher}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>

                        <div className='my-auto text-slate-500'>Год публикации</div>
                        <div className="my-auto">{data.items[0].volumeInfo.publishedDate}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>

                        <div className='my-auto text-slate-500'>Количество страниц</div>
                        <div className="my-auto">{data.items[0].volumeInfo.pageCount}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>

                      { data.items[0].volumeInfo.categories &&
                          <>
                        <div className='my-auto text-slate-500'>Категория</div>
                        <div className="my-auto">{data.items[0].volumeInfo.categories.map((c: string, i: number) => <div
                          key={i}>{c}</div>)}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>
                        </>
                      }

                        <div className='my-auto text-slate-500'>Язык</div>
                        <div className="my-auto">{data.items[0].volumeInfo.language}</div>
                        <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                title='Использовать это значение' view='clear' size='s' form='round'/>

                      {data.items[0].volumeInfo.industryIdentifiers.map((ii: { type: string, identifier: string }) =>
                        <>
                          <div className='my-auto text-slate-500'>{ii.type.replace('_', ' ')}</div>
                          <div className="my-auto">{ii.identifier}</div>
                          <Button className="ms-auto me-4" onlyIcon iconLeft={IconLightningBolt}
                                  title='Использовать это значение' view='clear' size='s' form='round'/>
                        </>
                      )}
                    </div>
                </div>
            }
          </>
      }
      {!identifiers?.isbn.isbn13 && <span className='italic ms-1 font-light text-sm cursor-pointer'>Добавить идентификаторы, такие как ISBN</span>}
    </div>
  )
}