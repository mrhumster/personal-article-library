import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'


export const PDFViewer = () => {
  const file = useSelector((state: RootState) => state.ui.reader.activeTab)
  // const { data } = useGetFileQuery(file?.id, {skip: !file})
  const newPlugin = defaultLayoutPlugin()
  return (
    <div className='pdf-container'>
    <Worker workerUrl={`//unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
      {file && <Viewer fileUrl={`/media/${file.file_uuid}`} plugins={[newPlugin]} />}
    </Worker>
    </div>
  )
}