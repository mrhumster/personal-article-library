import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetFileQuery} from "../../services/backend";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { pdfjs } from 'react-pdf';
import {Button} from "@consta/uikit/Button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const ShowFile = () => {
  const file = useSelector((state: RootState) => state.ui.reader.activeTab)

  const {data} = useGetFileQuery(file?.id, {skip: !file})
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({numPages}: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className='flex flex-col bg-zinc-700'>
      <div className={'bg-zinc-800'}>
        <Button className={'m-1'} label='Назад' size='xs' disabled={pageNumber === 1} onClick={() => {
          setPageNumber(pageNumber - 1)
        }}/>
        <Button label='Вперед' size='xs'  disabled={pageNumber === numPages} onClick={() => {
          setPageNumber(pageNumber + 1)
        }}/>
      </div>
      <Document className='reader ms-auto me-auto h-screen'
                file={`/media/${data.file_uuid}`}
                onLoadSuccess={onDocumentLoadSuccess}
      >
        {numPages && [...Array(numPages).keys()].map((page) => {
           return <Page key={page + 1} pageNumber={page + 1}/>
          }
        )}
      </Document>
    </div>
  );
}