import React, {useRef, useState} from "react";
import {ContextMenu, ContextMenuItemDefault} from "@consta/uikit/ContextMenu";
import {Button} from "@consta/uikit/Button";
import {IconAdd} from "@consta/icons/IconAdd";
import {IconEdit} from "@consta/icons/IconEdit";
import {AddNewFileButton} from "./AddNewFileButton.tsx";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconDocAdd} from "@consta/icons/IconDocAdd";
import {Text} from "@consta/uikit/Text";
import {useDispatch, useSelector} from "react-redux";
import {openLeftSideBar} from "../../features/ui";
import {initNewArticle} from "../../features/article";
import {RootState} from "../../store";


export const AddNewButtonWithDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const new_article = useSelector((state: RootState) => state.articles.new_article)
  const ref = useRef(null);
  const dispatch = useDispatch()

  const addArticleHandle = () => {
    if (!new_article) dispatch(initNewArticle())
    dispatch(openLeftSideBar())
    setIsOpen(false)
  }

  const items: ContextMenuItemDefault[] = [
  {
    label: '',
    leftIcon: undefined,
    rightSide: <AddNewFileButton text={<><IconDocAdd className="my-auto" size={'xs'}/><Text className="ms-2" size={"s"}>Добавить с ПК</Text></>} />
  },
  {
    label: 'Добавить в ручную',
    leftIcon: IconEdit,
    onClick: addArticleHandle
  }
]

  return (
    <div className="flex justify-center items-center p-3 h-20 w-full">
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