import React from "react";
import {Modal} from "@consta/uikit/Modal";
import {Text} from "@consta/uikit/Text"
import {Button} from "@consta/uikit/Button";

export const ArticleCollectionRenameDialog = ({isOpen, setIsOpen, collection_id}:{isOpen: boolean, setIsOpen:  React.Dispatch<React.SetStateAction<boolean>>, collection_id: string}) => {
  return (
    <Modal
        isOpen={isOpen}
        hasOverlay
        onClickOutside={() => setIsOpen(false)}
        onEsc={() => setIsOpen(false)}
      >
        <Text as="p" size="s" view="secondary">
          Это заголовок модального окна
        </Text>
        <Text as="p" size="m" view="primary">
          Это содержимое модального окна. Здесь может быть что угодно: текст,
          изображение, форма или таблица. Всё, что хочется вынести из контекста
          и показать поверх основной страницы.
        </Text>
        <div>
          <Button
            size="m"
            view="primary"
            label="Закрыть"
            width="default"
            onClick={() => setIsOpen(false)}
          />
        </div>
      </Modal>
  )
}