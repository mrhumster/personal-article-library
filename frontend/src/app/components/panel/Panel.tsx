import React from "react";
import {AddNewButtonWithDropdown} from "./AddNewButtonWithDropdown.tsx";
import {TabsMenu} from "./TabsMenu.tsx";

export const Panel = () => {
  return (
    <div id="menu" className="flex flex-col w-64 bg-zinc-200 border-r border-zinc-400">
      <AddNewButtonWithDropdown />
      <TabsMenu />
    </div>
  )
}