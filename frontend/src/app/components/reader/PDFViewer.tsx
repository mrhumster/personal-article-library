import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {
  DocumentLoadEvent,
  LocalizationMap,
  PdfJs,
  PrimaryButton,
  SpecialZoomLevel,
  Viewer,
  Worker
} from '@react-pdf-viewer/core'
import {
  defaultLayoutPlugin
} from '@react-pdf-viewer/default-layout'
import ru_RU from '@react-pdf-viewer/locales/lib/ru_RU.json'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import {
  useCreateHighlightMutation,
  useGetFileQuery,
  useGetHighlightByFileQuery,
  useUpdateFileMutation
} from "../../services/backend";
import moment from "moment";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightContentProps, RenderHighlightsProps,
  RenderHighlightTargetProps
} from '@react-pdf-viewer/highlight';
import {Tooltip, Position, Button} from '@react-pdf-viewer/core'
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {renderToolbar} from "./Toolbar.tsx";
import {HighlightScheme} from "../../types/article.types.ts";
import {showHighlight} from "../../features/ui";
import {Annotation} from "../annotations/elements/Annotation.tsx";




export const PDFViewer = () => {
  const file = useSelector((state: RootState) => state.ui.reader.activeTab)
  const noteForJump = useSelector((state: RootState) => state.ui.reader.showHighlight)
  const [updateFile] = useUpdateFileMutation()
  const {data, refetch} = useGetFileQuery(file?.id, {skip: !file?.id})
  const username = useSelector((state: RootState) => state.auth.username)
  const [openData, setOpenData] = useState<string | null>(null)
  const [scale, setScale] = useState<number | SpecialZoomLevel>(1)
  const [page, setPage] = useState<number>(0)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const tz = useSelector((state: RootState) => state.ui.timezone)
  const [message, setMessage] = React.useState('');
  const [notes, setNotes] = React.useState<HighlightScheme[]>([]);
  const notesContainerRef = React.useRef<HTMLDivElement | null>(null);
  const noteElements: Map<number, HTMLElement> = new Map();
  const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument | null>(null);
  const [createHighlight, createHighlightResult] = useCreateHighlightMutation()
  const {data: dataHighlights, refetch: refetchHighlights} = useGetHighlightByFileQuery(file?.id, {skip: !file?.id})
  const dispatch = useDispatch()

  useEffect(() => setFileUrl(`/media/${file?.file_uuid}`), [file])

  useEffect(()=>{if (dataHighlights) setNotes(dataHighlights)}, [dataHighlights])

  useEffect(()=>{if (createHighlightResult.isSuccess) refetchHighlights()}, [createHighlightResult.isSuccess])

  useEffect(() => {
    if (noteForJump) {
      jumpToHighlightArea(noteForJump.highlightAreas[0])
      dispatch(showHighlight(undefined))
    }
  }, [noteForJump])

  const handleDocumentLoad = (e: DocumentLoadEvent) => {setCurrentDoc(e.doc)};

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.RightCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon/>
          </Button>
        }
        content={() => <div style={{width: '100px'}}>Новая комментарий</div>}
        offset={{left: 10, top: 0}}
      />
    </div>
  );

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    const addNote = () => {
      if (message !== '' && file?.id) {
        const note: HighlightScheme = {
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
          file: file?.id
        };
        props.cancel();
        createHighlight(note)
      }
    };

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(0, 0, 0, .3)',
          borderRadius: '2px',
          padding: '8px',
          position: 'absolute',
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          zIndex: 1,
        }}
      >
        <div>
          <textarea
            rows={3}
            style={{
              border: '1px solid rgba(0, 0, 0, .3)',
            }}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '8px',
          }}
        >
          <div style={{marginRight: '8px'}}>
            <PrimaryButton onClick={addNote}>Добавить</PrimaryButton>
          </div>
          <Button onClick={props.cancel}>Отмена</Button>
        </div>
      </div>
    );
  };

  const jumpToNote = (note: HighlightScheme) => {
    activateTab(3);
    const notesContainer = notesContainerRef.current;
    if (note.id && noteElements.has(note.id) && notesContainer) {
      notesContainer.scrollTop = (noteElements.get(note.id) as HTMLDivElement).getBoundingClientRect().top;
    }
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <div>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign({}, {background: 'yellow', opacity: 0.4,}, props.getCssProperties(area, props.rotation))}
                onClick={() => jumpToNote(note)}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

  const { jumpToHighlightArea } = highlightPluginInstance;

  useEffect(() => {return () => {noteElements.clear()}}, []);

  const sidebarNotes = (
    <div
      ref={notesContainerRef}
      style={{
        overflow: 'auto',
        width: '100%',
      }}
    >
      {notes.length === 0 && <div style={{textAlign: 'center'}}>Аннотаций нет</div>}
      {notes.map((note) => {
        return (
          <div
            key={note.id}
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, .3)',
              cursor: 'pointer',
              padding: '8px',
            }}
            onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
            ref={(ref): void => {
              if (note.id) {
                noteElements.set(note.id, ref as HTMLElement);
              }
            }}
          >
            <blockquote
              style={{
                borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                fontSize: '.75rem',
                lineHeight: 1.5,
                margin: '0 0 8px 0',
                paddingLeft: '8px',
                textAlign: 'justify',
              }}
            >
              {note.quote}
            </blockquote>
            {note.content}
          </div>
        );
      })}
    </div>
  );


  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar, sidebarTabs: (defaultTabs) =>
      defaultTabs.concat({
        content: sidebarNotes,
        icon: <MessageIcon/>,
        title: 'Аннотации',
      }),
  })

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

  const {activateTab} = defaultLayoutPluginInstance;

  return (
    <div className='pdf-container'>
      <Worker workerUrl={`//unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
        {fileUrl &&
            <Viewer
                fileUrl={fileUrl}
                localization={ru_RU as unknown as LocalizationMap}
                plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
                theme={'dark'}
                initialPage={page}
                defaultScale={scale}
                onZoom={(e) => setScale(e.scale)}
                onPageChange={handlePageChange}
                onDocumentLoad={handleDocumentLoad}
            />
        }
      </Worker>
    </div>
  )
}