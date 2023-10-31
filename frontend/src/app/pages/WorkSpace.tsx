import {Layout, LayoutMain, Panel} from "../components";
import React from "react";

export const WorkSpace = () => {
  return (
    <Layout>
      <div className="flex flex-row w-full h-full">
        <Panel />
        <LayoutMain />
      </div>
    </Layout>
  )
}