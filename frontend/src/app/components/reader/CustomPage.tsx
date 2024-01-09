import {Page} from "react-pdf";
import React, {useEffect, useRef, useState} from "react";

interface CustomPageIFace {
  pageNumber: number
  pageRefs: object
  setPageRefs: React.Dispatch<React.SetStateAction<object>>
  documentRef: React.MutableRefObject<any>,
  scale: number
}

export const CustomPage = (props: CustomPageIFace) => {
  const {
    pageNumber,
    pageRefs,
    setPageRefs,
    documentRef,
    scale
  } = props
  const ref = useRef(null)
  const [x, setX] = useState<number|null>(null);
  const [y, setY] = useState<number|null>(null);

  const getPosition = () => {
    if (ref.current) {
      const x = ref.current.offsetLeft;
      setX(x);


      const y = ref.current?.offsetTop;
      setY(y);
    }
  };




  useEffect(() => {
    if (documentRef.current) {
      documentRef.current.addEventListener('scroll', getPosition)
    }
    return ()=> {
      if (documentRef.current) {
        documentRef.current.removeEventListener('scroll', getPosition)
      }
    }
  }, [])


  return (
    <div ref={ref}>
      <Page width={600} wrap={false} scale={scale} pageNumber={pageNumber}/>
    </div>
  )
}