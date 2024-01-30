import React, {useEffect, useRef, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {useCreateMyCollectionMutation} from "../../services/backend";
import {CollectionIFace} from "../../types";
import {useDebounce} from "@consta/uikit/useDebounce";
import {Button} from "@consta/uikit/Button";


export const AddNewCollection = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [collectionName, setCollectionName] = useState<string | null>(null)
  const [ createMyCollection, {isLoading} ] = useCreateMyCollectionMutation()

  const handleClick = (event: TouchEvent | MouseEvent) => {
    if (inputRef.current) {
      if (!inputRef.current.contains(event.target as Node)) {
        setIsClicked(false)
      }
    }
  }

  const handleChange = (value : string | null ) => {
    setCollectionName(value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && collectionName) {
      debouncedCreate({title: collectionName, articles: []})
    }
  }

  const createCollectionOnBackend = (body: CollectionIFace) => {
    createMyCollection(body)
    setCollectionName(null)
  }

  const debouncedCreate = useDebounce(createCollectionOnBackend, 300)

  useEffect(()=>{
    if (!isClicked && collectionName) {
      debouncedCreate({title: collectionName, articles: []})
    }
  }, [isClicked, collectionName])

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  if (isClicked) return <TextField className="px-2 mt-1"
                                   size={'s'}
                                   ref={inputRef}
                                   value={collectionName}
                                   onChange={handleChange}
                                   onKeyPress={handleKeyPress}
                                   placeholder={'Название коллекции'}/>
  {/*if (!isClicked) return <Text className="ms-4 my-2 cursor-pointer hover:underline italic text-stone-500" onClick={() => setIsClicked(true)}>Новая коллекция</Text>*/}
  if (!isClicked) return (
    <div className={'mx-2 mt-2'}>
      <Button size={'s'} width={'full'} view={'clear'} loading={isLoading} onClick={() => setIsClicked(true)} label='Добавить коллекцию'/>
    </div>
  )
}