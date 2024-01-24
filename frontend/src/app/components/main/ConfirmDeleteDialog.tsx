import {Modal} from "@consta/uikit/Modal";
import React from "react";
import {Text} from "@consta/uikit/Text";
import {Button} from "@consta/uikit/Button";
import {Card} from "@consta/uikit/Card";
import {IconClose} from "@consta/icons/IconClose"
import {useDeleteArticleMutation} from "../../services/backend";

interface ConfirmDeleteDialogPropsIFace {
  items: string[]
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export const ConfirmDeleteDialog = (props: ConfirmDeleteDialogPropsIFace) => {
  const [ deleteArticle ] = useDeleteArticleMutation()

  const confirmHandler = () => {
    props.items.map((article_id) => {
      deleteArticle(article_id)
    })
    props.setShow(false)
  }

  return (
    <Modal isOpen={props.show} hasOverlay={false}>
      <Card className='w-[360px] h-[300px] border flex flex-col'>
        <div className='flex p-4 border-b'>
          <Text className='grow ps-2 mt-auto mb-auto' size={'l'} weight={'bold'}>Удалить навсегда?</Text>
          <Button view={'clear'} size={'s'} form={'round'} iconLeft={IconClose} onClick={() => props.setShow(false)}/>
        </div>
        <div className={'grow overflow-y-auto m-5 px-1'}>
          <Text weight={'light'} size={'s'}>Выбранные ссылки будут удалены безвозвратно. Все связанные ссылки будут потеряны.</Text>
          <Text className={'pt-2'} weight={'bold'} size={'s'}>Внимание: Вы не сможете отменить это действие.</Text>
        </div>
        <div className={'flex px-3 py-1 h-16 border-t'}>
            <Button className={'grow mx-1 mt-auto mb-auto'} label={'Отменить'} size={'s'} view={'clear'} onClick={() => props.setShow(false)} />
            <Button className={'grow mx-1 mt-auto mb-auto'} label={'Удалить'} size={'s'} view={'primary'} onClick={confirmHandler}/>
        </div>
      </Card>
    </Modal>
  )
}