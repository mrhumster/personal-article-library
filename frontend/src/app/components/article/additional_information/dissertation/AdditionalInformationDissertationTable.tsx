import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {AdditionalInformationTableLayout} from "../layout/AdditionalInformationTableLayout.tsx";

export const AdditionalInformationDissertationTable = () => {
  const additional_information = useSelector((state: RootState) => state.articles.current_article?.additional_information)
  return (
    <AdditionalInformationTableLayout>
      <>
        <div className={'text-slate-500'}>Город: </div>
        <div>{additional_information?.city}</div>
        <div className={'text-slate-500'}>Учреждение: </div>
        <div>{additional_information?.institution}</div>
        <div className={'text-slate-500'}>Департамент: </div>
        <div>{additional_information?.departament}</div>
        <div className={'text-slate-500'}>Тип: </div>
        <div>{additional_information?.type}</div>
        <div className={'text-slate-500'}>Месяц: </div>
        <div>{additional_information?.month}</div>
        <div className={'text-slate-500'}>День: </div>
        <div>{additional_information?.day}</div>
      </>
    </AdditionalInformationTableLayout>
  )
}