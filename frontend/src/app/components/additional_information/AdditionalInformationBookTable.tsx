import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {AdditionalInformationTableLayout} from "./AdditionalInformationTableLayout.tsx";

export const AdditionalInformationBookTable = () => {
  const additional_information = useSelector((state: RootState) => state.articles.current_article?.additional_information)
  return (
    <AdditionalInformationTableLayout>
      <>
        <div className={'text-slate-500'}>Издание: </div><div>{additional_information?.edition}</div>
        <div className={'text-slate-500'}>Редакторы: </div>
        <div>{additional_information?.editors?.map(
          ({last_name, first_name, sur_name})=>
            `${last_name} ${first_name} ${sur_name}`).map((content, index) => <div key={index}>{content}</div>)}
        </div>
        <div className={'text-slate-500'}>Город: </div>
        <div>{additional_information?.city}</div>
        <div className={'text-slate-500'}>Издатель: </div>
        <div>{additional_information?.publisher}</div>
      </>
    </AdditionalInformationTableLayout>
  )
}