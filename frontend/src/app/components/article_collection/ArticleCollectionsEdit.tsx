import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {CollectionBadge} from "./CollectionBadge.tsx";

export const ArticleCollectionsEdit = () => {
  const { ids, entities } = useSelector((state: RootState) => state.collections)
  const [colIds, setColIds] = useState<string[] | undefined>(undefined)
  const article_id = useSelector((state: RootState) => state.articles.current_article?.id)

  useEffect(()=>{
    if (ids && article_id) {
      const filtered_ids =  ids.filter((id) => {
        console.log('DEBUG', article_id, entities[id].articles)

        if (entities[id].articles.includes(article_id)) {
          return id
        }

      })
      console.log(filtered_ids)
      setColIds(filtered_ids)
    }
  }, [ids, entities, article_id])

  return (
    <div id="article_collections" className="my-4">
      <div className='ms-1 text-zinc-500'>Коллекции</div>
      {colIds?.length === 0 ?
        <div className="text-sm ms-1 text-zinc-400 italic">Ссылка не находится ни в одной коллекции</div> :
        colIds && colIds.map((id) => <CollectionBadge key={id} collection={entities[id]} />)
      }
    </div>
  )
}