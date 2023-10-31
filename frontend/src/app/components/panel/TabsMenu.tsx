import React from "react";
import {IconComponent} from "@consta/uikit/Icon";
import {List} from "@consta/uikit/ListCanary";
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {IconBookmarkStroked} from "@consta/uikit/IconBookmarkStroked";
import {IconBook, IconClock, IconCopyFile, IconOpenBook, IconStar, IconTrash} from "./Icons.ts";

type Item = {
  label: string;
  leftIcon: IconComponent;
};

const items: Item[] = [
  {
    label: 'Все ссылки',
    leftIcon: IconBook,
  },
  {
    label: 'Недавно добавленные',
    leftIcon: IconClock,
  },
  {
    label: 'Недавно прочитал',
    leftIcon: IconBookmarkStroked,
  },
  {
    label: 'Избранное',
    leftIcon: IconStar,
  },
  {
    label: 'Мои публикации',
    leftIcon: IconOpenBook,
  },
  {
    label: 'Дубликаты',
    leftIcon: IconCopyFile,
  },
  {
    label: 'Корзина',
    leftIcon: IconTrash,
  },
];

export const TabsMenu = () => {

  return (
    <Theme preset={presetGpnDefault}>
      <div className="ms-1 me-1">
      <List
        size={'s'}
        items={items}
        onItemClick={(item) => alert(`${item.label} ${item}`)}
      />
      </div>
    </Theme>
  );
}