import React, {useRef, useState} from "react";
import {ContextMenu} from "@consta/uikit/ContextMenu";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconComponent} from "@consta/uikit/Icon";
import {IconEdit} from "@consta/uikit/IconEdit";
import {AddNewFileButton} from "./AddNewFileButton.tsx";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";


type Item = {
  label?: string,
  imageLeft?: IconComponent,
  imageRight?: IconComponent
  leftSide?: React.ReactNode
  rightSide?: React.ReactNode
}

const items: Item[] = [
  {
    label: undefined,
    imageLeft: undefined,
    rightSide: <AddNewFileButton />
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
    <div className="flex justify-center items-center p-3 h-20 w-full select-none">
      <Button ref={ref}
              label="Добавить"
              view={'primary'}
              size={'s'}
              onClick={() => setIsOpen(!isOpen)}
              iconLeft={IconAdd}
      />
      <Theme preset={presetGpnDefault}>
      <ContextMenu
        isOpen={isOpen}
        items={items}
        getItemLabel={(item) => item.label? item.label : ''}
        getItemLeftIcon={(item) => item.imageLeft}
        getItemRightIcon={(item) => item.imageRight}
        onClickOutside={() => setIsOpen(false)}
        anchorRef={ref}
        direction={'downRight'}
        offset={5}
        arrowOffset={58}
        size={'s'}
      />
        </Theme>
    </div>
  );
}