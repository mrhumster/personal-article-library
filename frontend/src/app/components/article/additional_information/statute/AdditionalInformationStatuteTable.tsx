import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {AdditionalInformationTableLayout} from "../layout/AdditionalInformationTableLayout.tsx";

export const AdditionalInformationStatuteTable = () => {
  const additional_information = useSelector((state: RootState) => state.articles.current_article?.additional_information)
  return (
    <AdditionalInformationTableLayout>
      <>
        <div className={'text-slate-500'}>Источник: </div>
        <div>{additional_information?.source}</div>
        <div className={'text-slate-500'}>Страна: </div>
        <div>{additional_information?.country}</div>
        <div className={'text-slate-500'}>Номер документа: </div>
        <div>{additional_information?.statute_number}</div>
        <div className={'text-slate-500'}>Код: </div>
        <div>{additional_information?.code}</div>
        <div className={'text-slate-500'}>Месяц: </div>
        <div>{additional_information?.month}</div>
        <div className={'text-slate-500'}>День: </div>
        <div>{additional_information?.day}</div>
      </>
    </AdditionalInformationTableLayout>
  )
}