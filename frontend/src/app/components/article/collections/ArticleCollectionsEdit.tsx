import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {ArticleCollectionBadge} from "./ArticleCollectionBadge.tsx";

export const ArticleCollectionsEdit = () => {
  const { ids, entities } = useSelector((state: RootState) => state.collections)
  const [colIds, setColIds] = useState<string[] | undefined>(undefined)
  const article_id = useSelector((state: RootState) => state.articles.current_article?.id)

  useEffect(()=>{
    if (ids && article_id) {
      const filtered_ids =  ids.filter((id) => {
        if (entities[id].articles.includes(article_id)) {
          return id
        }
      })
      setColIds(filtered_ids)
    }
  }, [ids, entities, article_id])

  return (
    <div id="article_collections" className="my-3">
      <div className='ms-1 text-zinc-500/90 uppercase text-xs font-semibold tracking-[.1em]'>Коллекции</div>
      {colIds?.length === 0 ?
        <div className="text-sm ms-1 text-zinc-400 italic">Не найдено коллекций</div> :
        colIds && colIds.map((id) => <ArticleCollectionBadge key={id} collection={entities[id]} />)
      }
    </div>
  )
}