import {Layout, LayoutMain, Panel} from "../components";
import React from "react";
import {UploadProgress} from "../components/popup/UploadProgress.tsx";

export const WorkSpace = () => {
  return (
    <Layout>
      <div className="flex flex-row w-full h-full">
        <Panel />
        <LayoutMain />
        <UploadProgress />
      </div>
    </Layout>
  )
}