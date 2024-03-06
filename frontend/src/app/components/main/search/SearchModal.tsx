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

  useEffect(()=>{
    if (isSuccess) {
      console.log(data)
    }
  }, [data, isSuccess])

  useEffect(() => {
    debounceSetSearchValue(value)
  }, [value])

  return (
    <Modal className={'border p-3 w-1/2'}
           isOpen={isOpen}
           onEsc={() => closeDialog()}
           onClickOutside={() => closeDialog()}
           hasOverlay={false}
           position={'top'}
    >
        <TextField size={'s'}
                   leftSide={IconSearchStroked}
                   withClearButton={true}
                   value={value}
                   onChange={setValue}
        />
        {data && isSuccess &&
          <div className={'grid grid-col-1 gap-3 mt-3'}>
            {data.filter(item => item._index === 'articles').length !==0 && <Text className={'m-2'} weight={'semibold'} view={'secondary'}>Ссылки</Text>}
            {data.filter(item => item._index === 'articles').map(item => <FoundArticle key={item._id} item={item} />)}
            {data.filter(item => item._index === 'files').length !==0 && <Text className={'m-2'} weight={'semibold'} view={'secondary'}>Файлы</Text>}
            {data.filter(item => item._index === 'files').map(item => <FoundFiles key={item._id} item={item} />)}
          </div>
        }
      {
        !data &&
          <div className={'w-full h-60 flex flex-col items-center justify-center'}>
            <Text size='xl' weight='semibold' view='secondary'>Ничего не нашли</Text>
            <Text weight='light' view='secondary' align='center'>Попробуйте спросить по другому</Text>
          </div>
      }
    </Modal>
  )
}