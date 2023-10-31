import React, {useRef, useState} from "react";
import {ContextMenu} from "@consta/uikit/ContextMenu";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconComponent} from "@consta/uikit/Icon";
import {IconDocAdd} from "@consta/uikit/IconDocAdd";
import {IconEdit} from "@consta/uikit/IconEdit";

type Item = {
  label: string,
  imageLeft?: IconComponent,
  imageRight?: IconComponent
}

const items: Item[] = [
  {
    label: 'Загрузить с ПК',
    imageLeft: IconDocAdd
  },
  {
    label: 'Добавить вручную',
    imageLeft: IconEdit
  }
]

export const AddNewButtonWithDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef(null);
  return (
    <div className="flex justify-center items-center p-3 h-20 w-full">
      <Button ref={ref}
              label="Добавить"
              view={'primary'}
              size={'s'}
              onClick={() => setIsOpen(!isOpen)}
              iconLeft={IconAdd}
      />
      <ContextMenu
        isOpen={isOpen}
        items={items}
        getItemLabel={(item) => item.label}
        getItemLeftIcon={(item) => item.imageLeft}
        getItemRightIcon={(item) => item.imageRight}
        onClickOutside={() => setIsOpen(false)}
        anchorRef={ref}
        direction={'downRight'}
        offset={5}
        arrowOffset={58}
        size={'s'}
      />
    </div>
  );
}