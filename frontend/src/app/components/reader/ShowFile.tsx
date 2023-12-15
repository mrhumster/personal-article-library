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
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={`/media/${data.file_uuid}`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
      <div>
        <Button label='Назад' disabled={pageNumber === 1} onClick={()=>{setPageNumber(pageNumber-1)}}/>
        <Button label='Вперед' disabled={pageNumber === numPages} onClick={()=>{setPageNumber(pageNumber+1)}}/>
      </div>
    </div>
  );
}