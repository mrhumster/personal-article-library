import React, {ReactElement, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {LocalizationMap, SpecialZoomLevel, Viewer, Worker} from '@react-pdf-viewer/core'
import {
  defaultLayoutPlugin,
  ToolbarProps, ToolbarSlot
} from '@react-pdf-viewer/default-layout'
import ru_RU from '@react-pdf-viewer/locales/lib/ru_RU.json'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import {useGetFileQuery, useUpdateFileMutation} from "../../services/backend";
import moment from "moment";
import {OpenRightSideBar} from "./buttons";


export const PDFViewer = () => {
  const file = useSelector((state: RootState) => state.ui.reader.activeTab)
  const [updateFile] = useUpdateFileMutation()
  const {data, refetch} = useGetFileQuery(file?.id, {skip: !file?.id})
  const username = useSelector((state: RootState) => state.auth.username)
  const [openData, setOpenData] = useState<string | null>(null)
  const [scale, setScale] = useState<number | SpecialZoomLevel>(1)
  const [page, setPage] = useState<number>(0)
  const tz = useSelector((state: RootState) => state.ui.timezone)

  const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
    <Toolbar>
      {(slots: ToolbarSlot) => {
        const {
          CurrentPageLabel,
          Download,
          EnterFullScreen,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          Print,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;
        return (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              width: '100%',
            }}
          >
            <div style={{padding: '0px 2px', marginLeft: '5px'}}>
              <OpenRightSideBar />
            </div>
            <div style={{padding: '0px 2px'}}>
              <Print/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <Download/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <EnterFullScreen/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <ShowSearchPopover/>
            </div>
            <div style={{padding: '0px 2px', marginLeft: 'auto'}}>
              <ZoomOut/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <Zoom/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <ZoomIn/>
            </div>
            <div style={{padding: '0px 2px', marginLeft: 'auto'}}>
              <GoToPreviousPage/>
            </div>
            <div style={{padding: '0px 2px'}} className={'flex text-zinc-100'}>
              <CurrentPageLabel/> / <NumberOfPages/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <GoToNextPage/>
            </div>
          </div>
        );
      }}
    </Toolbar>
  );

  const newPlugin = defaultLayoutPlugin({renderToolbar})

  useEffect(() => {
    setOpenData(moment().tz(tz).toISOString())
  }, [])

  useEffect(() => {
    if (data && username && data.history && 'wasOpening' in data.history) {
      const user_scale = data.history?.wasOpening[username].scale
      if (user_scale) setScale(user_scale)
      const user_page = data.history?.wasOpening[username].page
      if (user_page) setPage(user_page)
    }
  }, [data, username])

  useEffect(() => {
    refetch()
  }, [])

  const handlePageChange = ({currentPage}: { currentPage: number }) => {
    console.log(data)
    if (data && username && scale) {
      updateFile({
        ...data,
        history: {
          wasOpening: {
            [username]: {
              page: currentPage,
              scale: scale,
              lastOpeningDate: openData
            }
          }
        }
      })
    }
  }


  return (
    <div className='pdf-container'>
      <Worker workerUrl={`//unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
        {file &&
            <Viewer fileUrl={`/media/${file.file_uuid}`}
                    localization={ru_RU as unknown as LocalizationMap}
                    plugins={[newPlugin]}
                    theme={'dark'}
                    initialPage={page}
                    defaultScale={scale}
                    onZoom={(e) => setScale(e.scale)}
                    onPageChange={handlePageChange}

            />
        }
      </Worker>
    </div>
  )
}