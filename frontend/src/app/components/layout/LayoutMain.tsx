import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {TableArticles} from "../main";
import {TrashView} from "../main/TrashView.tsx";

export const LayoutMain = () => {
  const item_selected = useSelector((state: RootState) => state.ui.checked)
  const collection = useSelector((state: RootState) => item_selected.group === 2 ? state.collections.entities[item_selected.id] : undefined)
  let content: React.ReactNode | undefined
  if (item_selected.group === 1) {
    switch (item_selected.id) {
      case '0':
        content = <TableArticles title={'Все ссылки'}/>
        break
      case '1':
        content = <div>Недавно добавленные</div>
        break
      case '6':
        // TODO: Надо представление допилить
        content = <TrashView />
        break
    }
  }
  if (item_selected.group === 2) {
    content = <TableArticles filter={collection?.articles} title={collection?.title} />
  }
  return (
      <div id="menu" className="w-full bg-white select-none">
        {content && content}
      </div>
  )
}