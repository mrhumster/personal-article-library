import {Layout, LayoutMain, Panel} from "../components";
import React, {useRef} from "react";
import {UploadProgress} from "../components/popup/UploadProgress.tsx";
import {LeftSideBar, RightSideBar} from "../components/sidebar";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {Reader} from "../components/reader";

export const WorkSpace = () => {
  const isReaderOpen = useSelector((state: RootState) => state.ui.reader.isReaderOpen)
  const ref = useRef<HTMLDivElement>(null)
  return (
    <Layout>
      <div className="flex flex-row w-full h-full" ref={ref}>
        <LeftSideBar parent={ref} />
        { !isReaderOpen && <><Panel /><LayoutMain /></> }
        { isReaderOpen && <><Reader /></> }
        <UploadProgress />
        <RightSideBar />
      </div>
    </Layout>
  )
}