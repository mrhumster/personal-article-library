import React, {useRef, useState} from "react";
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/uikit/IconAdd";
import {IconEdit} from "@consta/uikit/IconEdit";
import {AddNewFileButton} from "./AddNewFileButton.tsx";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconDocAdd} from "@consta/uikit/IconDocAdd";
import {Text} from "@consta/uikit/Text";


const items: ContextMenuItemDefault[] = [
  {
    label: '',
    leftIcon: undefined,
    rightSide: <AddNewFileButton text={<><IconDocAdd className="my-auto" size={'xs'}/><Text className="ms-2" size={"s"}>Добавить с ПК</Text></>} />
  },
  {
    label: 'Добавить вручную',
    leftIcon: IconEdit
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
        getItemLeftIcon={(item) => item.leftIcon}
        getItemRightIcon={(item) => item.rightIcon}
        onClickOutside={() => setIsOpen(false)}
        anchorRef={ref}
        direction={'downRight'}
        offset={5}
        size={'s'}
      />
        </Theme>
    </div>
  );
}