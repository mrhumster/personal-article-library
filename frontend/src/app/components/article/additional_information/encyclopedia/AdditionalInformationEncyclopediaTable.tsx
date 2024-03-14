import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {AdditionalInformationTableLayout} from "../layout/AdditionalInformationTableLayout.tsx";
import {authorToString} from "../../../../utils";
import {User} from "@consta/uikit/User";

export const AdditionalInformationEncyclopediaTable = () => {
  const additional_information = useSelector((state: RootState) => state.articles.current_article?.additional_information)
  return (
    <AdditionalInformationTableLayout>
      <>
        <div className={'text-slate-500'}>Издание: </div><div>{additional_information?.edition}</div>
        <div className={'text-slate-500'}>Редакторы: </div>
        <div className={'flex flex-wrap w-64'}>{additional_information?.editors?.map(
          (editor)=>
            authorToString(editor)).map((name, index) => {
              if (name) return <User className={'cursor-pointer'} key={index} info={'Редактор'} name={name} />
            })}
        </div>
        <div className={'text-slate-500'}>Город: </div>
        <div>{additional_information?.city}</div>
        <div className={'text-slate-500'}>Издатель: </div>
        <div>{additional_information?.publisher}</div>
        <div className={'text-slate-500'}>Месяц: </div>
        <div>{additional_information?.month}</div>
        <div className={'text-slate-500'}>День: </div>
        <div>{additional_information?.day}</div>
      </>
    </AdditionalInformationTableLayout>
  )
}