import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetFileQuery} from "../../services/backend";
import { Document } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import {Button} from "@consta/uikit/Button";
import {CustomPage} from "./CustomPage.tsx";
import {Text} from "@consta/uikit/Text"

import { PDFViewer } from '@react-pdf/renderer';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const ShowFile = () => {
  const file = useSelector((state: RootState) => state.ui.reader.activeTab)

  const {data} = useGetFileQuery(file?.id, {skip: !file})
  const [pageRefs, setPageRefs] = useState({})
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const documentRef = useRef(null)
  const [scale, setScale] = useState<number>(1)

  function onDocumentLoadSuccess({numPages}: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className='flex flex-col bg-zinc-700'>
      <div className='flex bg-zinc-800'>
        <div id='scaller' className='flex p-1 w-32'>
          <Button label='-' size='xs' view='secondary' disabled={scale <= .1} onClick={() => {
            setScale(scale - .1)
          }}/>
          <Text className='grow px-1' weight='bold' view='normal' align='center'>{Math.round(scale * 100)} %</Text>
          <Button label='+' size='xs' view='secondary' disabled={scale >= 10} onClick={() => {
            setScale(scale + .1)
          }}/>
        </div>

      </div>
      <div className='reader ms-auto me-auto h-screen w-full'
           ref={documentRef}
      >
        <Document file={`/media/${data.file_uuid}`}
                  onLoadSuccess={onDocumentLoadSuccess}
        >
          {numPages && [...Array(numPages).keys()].map((page) => {
              return <CustomPage
                key={page + 1}
                pageNumber={page + 1}
                pageRefs={pageRefs}
                setPageRefs={setPageRefs}
                documentRef={documentRef}
                scale={scale}
              />
            }
          )}
        </Document>
      </div>
    </div>
  );
}