import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {LocalizationMap, SpecialZoomLevel, Viewer, Worker} from '@react-pdf-viewer/core'
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout'
import ru_RU from '@react-pdf-viewer/locales/lib/ru_RU.json'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'


export const PDFViewer = () => {
  const file = useSelector((state: RootState) => state.ui.reader.activeTab)
  // const { data } = useGetFileQuery(file?.id, {skip: !file})
  const newPlugin = defaultLayoutPlugin()

  const handlePageChange = ({currentPage, doc}: {currentPage: number, doc: object}) => {
    console.log(currentPage)
    console.log(doc)
  }

  return (
    <div className='pdf-container'>
    <Worker workerUrl={`//unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
      {file &&
          <Viewer fileUrl={`/media/${file.file_uuid}`}
                  localization={ru_RU as unknown as LocalizationMap}
                  plugins={[newPlugin]}
                  theme={'dark'}
                  initialPage={10}
                  defaultScale={SpecialZoomLevel.PageFit}
                  onPageChange={handlePageChange}
          />
      }
    </Worker>
    </div>
  )
}