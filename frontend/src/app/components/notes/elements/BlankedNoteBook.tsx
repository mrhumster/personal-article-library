import React from "react";
import {Text} from "@consta/uikit/Text";

export const BlankedNoteBook = () => {
  return (
    <div className='grow flex flex-col items-center justify-center m-3'>
      <Text size='xl' weight='semibold' view='secondary'>Ваш блокнот пустой</Text>
      <Text weight='light' view='secondary' align='center'>Кликните &ldquo;Новая страница&rdquo;, что бы начать записывать свои мысли.</Text>
    </div>
  )
}