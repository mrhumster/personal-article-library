import {Modal} from "@consta/uikit/Modal";
import React, {useEffect, useState} from "react";
import {Card} from "@consta/uikit/Card";
import {Text} from "@consta/uikit/Text";
import {Button} from "@consta/uikit/Button";
import {IconClose} from "@consta/uikit/IconClose";
import {CheckboxGroup, CheckboxGroupDefaultItem} from '@consta/uikit/CheckboxGroup';
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateMyCollectionMutation} from "../../services/backend";


interface AddCollectionDialogPropsIFace {
  items: string[]
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddCollectionDialog = (props: AddCollectionDialogPropsIFace) => {
  const [value, setValue] = React.useState<CheckboxGroupDefaultItem[] | null>(null);
  const [items, setItems] = useState<CheckboxGroupDefaultItem[] | null>(null)
  const { ids, entities} = useSelector((state: RootState) => state.collections)
  const [ updateMyCollection ] = useUpdateMyCollectionMutation()

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

    /*if (value) {
      value.map((collection) => {
        updateMyCollection({id: collection.key, articles: props.items.map((item) => item.key)})
      })
    }
    */
  }

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
            <Button className={'grow mx-1 mt-auto mb-auto'} label={'Добавить'} size={'s'} view={'primary'} onClick={addClickHandler} />
          </div>
        </div>
      </Card>
    </Modal>
  )
}