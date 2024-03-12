import React, {useEffect, useState} from "react";
import {Modal} from "@consta/uikit/Modal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {closeSearchDialog} from "../../../features/ui";
import {TextField} from "@consta/uikit/TextField";
import {IconSearchStroked} from "@consta/icons/IconSearchStroked";
import {useSearchQuery} from "../../../services/backend";
import {useDebounce} from "@consta/uikit/useDebounce";
import {Text} from "@consta/uikit/Text"
import {FoundArticle} from "./FoundArticle.tsx";
import {FoundFiles} from "./FoundFiles.tsx";


export const SearchModal = () => {
  const isOpen = useSelector((state: RootState) => state.ui.search.showDialog)
  const [query, setQuery] = useState<string | null>(null)
  const [value, setValue] = useState<string | null>(null)
  const {data, isSuccess} = useSearchQuery({query}, {skip: !query})
  const debounceSetSearchValue = useDebounce(setQuery, 300)
  const dispatch = useDispatch()
  const closeDialog = () => dispatch(closeSearchDialog())

  useEffect(() => {debounceSetSearchValue(value)}, [value])

  return (
    <Modal className={'border border-zinc-400 w-full h-[80%] sm:w-7/8 md:w-5/6 lg:w-4/6 xl:w-4/6 2xl:w-1/2'}
           isOpen={isOpen}
           onEsc={() => closeDialog()}
           onClickOutside={() => closeDialog()}
           hasOverlay={false}
           position={'top'}
    >
        <TextField className={'p-3'}
                   size={'s'}
                   autoFocus
                   leftSide={IconSearchStroked}
                   withClearButton={true}
                   value={value}
                   onChange={setValue}
        />
        {data && isSuccess && query &&
          <div className={'grid grid-col-1 gap-3 content-start mt-0 overflow-y-auto h-[90%] px-3 m-0 pb-10'}>
            {data.filter(item => item._index === 'articles').length !==0 && <Text className={'m-2'} weight={'light'} view={'secondary'}>Ссылки</Text>}
            {data.filter(item => item._index === 'articles').map((item) => <FoundArticle key={item._id} item={item} query={query}/>)}
            {data.filter(item => item._index === 'files').length !==0 && <Text className={'m-2'} weight={'light'} view={'secondary'}>Файлы</Text>}
            {data.filter(item => item._index === 'files').map(item => <FoundFiles key={item._id} item={item} query={query}/>)}
          </div>
        }
      {
        (!data || data.length === 0 || !query) &&
          <div className={'w-full h-60 flex flex-col items-center justify-center'}>
            <Text size='xl' weight='semibold' view='secondary'>Ничего не нашли</Text>
            <Text weight='light' view='secondary' align='center'>Попробуйте спросить по другому</Text>
          </div>
      }
    </Modal>
  )
}