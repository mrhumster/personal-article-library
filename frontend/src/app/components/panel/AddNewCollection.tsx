import React, {useEffect, useRef, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import { Text } from '@consta/uikit/Text';


export const AddNewCollection = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const inputRef = useRef(null)

  const handleClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsClicked(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  if (isClicked) return <TextField className="ms-4 me-4" size={'s'} ref={inputRef} placeholder={'Имя коллекции'}/>
  if (!isClicked) return <Text className="ms-4 italic text-stone-500" onClick={() => setIsClicked(true)}>Новая коллекция</Text>

}