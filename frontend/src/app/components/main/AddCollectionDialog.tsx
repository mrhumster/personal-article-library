import {Modal} from "@consta/uikit/Modal";
import React, {useEffect, useState} from "react";
import {Card} from "@consta/uikit/Card";
import {Text} from "@consta/uikit/Text";
import {Button} from "@consta/uikit/Button";
import {IconClose} from "@consta/uikit/IconClose";
import {CheckboxGroup, CheckboxGroupDefaultItem} from '@consta/uikit/CheckboxGroup';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateMyCollectionMutation} from "../../services/backend";
import {addMessage, Item} from "../../features/alert";


interface AddCollectionDialogPropsIFace {
  items: string[]
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddCollectionDialog = (props: AddCollectionDialogPropsIFace) => {
  const [value, setValue] = React.useState<CheckboxGroupDefaultItem[] | null>(null);
  const [items, setItems] = useState<CheckboxGroupDefaultItem[] | null>(null)
  const { ids, entities} = useSelector((state: RootState) => state.collections)
  const [ updateMyCollection, result ] = useUpdateMyCollectionMutation()
  const dispatch = useDispatch()

  useEffect(()=>{
    if (ids && entities) {
      const items: CheckboxGroupDefaultItem[] = ids.map((id) =>{
        const item: CheckboxGroupDefaultItem = {
          key: id,
          label: entities[id].title,
        }
        return item
      })
      setItems(items)
    }
  }, [ids, entities])

  const addClickHandler = () => {
    if (value) value.map((v) => {
      if (v.key) updateMyCollection({collection_id: v.key, articles: [...entities[v.key].articles, ...props.items]})
    })
    setValue([])
    props.setShow(false)
  }

  useEffect(()=>{
    if (result.isSuccess) dispatch(addMessage({message: (value?.length === 1) ? 'Коллекция обновлена.' : 'Коллекции обновлены.'}))
  }, [result])

  return (
    <Modal isOpen={props.show} hasOverlay={false}>
      <Card className='w-[500px] h-[640px] border flex flex-col'>
        <div className='flex p-4 border-b'>
          <Text className='grow ps-2 mt-auto mb-auto' size={'l'} weight={'bold'}>Выбор коллекции</Text>
          <Button view={'clear'} size={'s'} form={'round'} iconLeft={IconClose} onClick={() => props.setShow(false)}/>
        </div>
        <div className={'grow overflow-y-auto m-5 px-1'}>
          { items &&
            <CheckboxGroup value={value} items={items} onChange={(props) => setValue(props.value)}/>
          }
        </div>
        <div className={'flex px-3 py-1 h-16 border-t'}>
          <div className={'basis-1/2'}>
            <Text weight={'light'} display={'inline'} size={'s'} className={'pe-1'}>Коллекций отмечено:</Text>
            <Text weight={'bold'} display={'inline'} size={'s'}>{value ? value.length : 0}</Text>
            <Button label={'Очистить все'} width={'full'} size={'xs'} view={'clear'} onClick={() => setValue([])}/>
          </div>
          <div className={'flex justify-end items-stretch basis-1/2'}>
            <Button className={'grow mx-1 mt-auto mb-auto'} label={'Отменить'} size={'s'} view={'clear'} onClick={() => props.setShow(false)} />
            <Button className={'grow mx-1 mt-auto mb-auto'} label={'Добавить'} size={'s'} view={'primary'} loading={result.isLoading} onClick={addClickHandler} />
          </div>
        </div>
      </Card>
    </Modal>
  )
}