import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Button} from "@consta/uikit/Button";
import {useGetMetaQuery} from "../../services/googleBookApi.ts";
import {IconArrowDown} from "@consta/icons/IconArrowDown";
import {IconArrowUp} from "@consta/icons/IconArrowUp";
import {ISBNExtra} from "./ISBNExtra.tsx";

export const IdentifiersCollapse = ({setIsExpanded}:{setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const identifiers = useSelector((state: RootState) => state.articles.current_article?.identifiers)
  const isbn = identifiers?.isbn.value
  const {data, isLoading, isSuccess} = useGetMetaQuery(isbn, {skip: !isbn})
  const [showMeta, setShowMeta] = useState<boolean>(false)

  const handleClickISBN = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    setShowMeta(!showMeta)
  }

  return (
    <div className={"cursor-pointer border border-dotted border-transparent hover:border-sky-700 rounded p-1"}
         onClick={() => setIsExpanded(true)}>
      {identifiers?.isbn.value &&
          <>
              <div className='grid grid-cols-[25%_55%_20%] gap-2 text-sm py-1 ps-1 text-m pb-3'>
                  <div className='my-auto text-slate-500'>ISBN:</div>
                  <div className='my-auto'>{identifiers?.isbn.value}</div>
                  <Button className='ms-auto me-4'
                          loading={isLoading}
                          disabled={isSuccess && data.totalItems === 0}
                          iconLeft={showMeta ? IconArrowUp : IconArrowDown}
                          size='s'
                          view='clear'
                          form='round'
                          onClick={handleClickISBN}
                          title='Показать данные найденные по ISBN'/>

              </div>
            {showMeta && isSuccess &&
                <ISBNExtra volumeItem={data.items[0]}/>
            }
          </>
      }
      {!identifiers?.isbn.value && <span className='italic ms-1 font-light text-sm cursor-pointer'>Добавить идентификаторы, такие как ISBN</span>}
    </div>
  )
}