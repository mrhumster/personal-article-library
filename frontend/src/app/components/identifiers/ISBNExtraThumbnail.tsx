import React from "react";

interface ISBNExtraThumbnailIFace {
  imageLinks?: {
    thumbnail: string
  }
}

export const ISBNExtraThumbnail = (props: ISBNExtraThumbnailIFace) => {
  if (!props.imageLinks) return null

  return (
    <div>
      <img className='w-32 ms-auto me-auto mt-2 mb-2 shadow-xl ' src={props.imageLinks.thumbnail} alt='Thumbnail'/>
    </div>
  )
}