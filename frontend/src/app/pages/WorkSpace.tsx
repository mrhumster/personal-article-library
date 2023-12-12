import {Layout, LayoutMain, Panel} from "../components";
import React from "react";
import {UploadProgress} from "../components/popup/UploadProgress.tsx";
import {RightSideBar} from "../components/sidebar";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {Reader} from "../components/reader";

export const WorkSpace = () => {
  const isReaderOpen = useSelector((state: RootState) => state.ui.reader.isReaderOpen)
  return (
    <Layout>
      <div className="flex flex-row w-full h-full">
        { !isReaderOpen &&
          <>
            <Panel />
            <LayoutMain />
          </>
        }
        {
          isReaderOpen &&
          <Reader />
        }
        <UploadProgress />
        <RightSideBar />
      </div>
    </Layout>
  )
}