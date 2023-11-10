import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {GridItem} from "@consta/uikit/Grid";
import {AdditionalInformationTableLayout} from "./AdditionalInformationTableLayout.tsx";

export const AdditionalInformationUnspecifiedTable = () => {
  const additional_information = useSelector((state: RootState) => state.articles.current_article?.additional_information)
  return (
    <AdditionalInformationTableLayout>
      <>
      <GridItem>Издание</GridItem>
      <GridItem>{additional_information?.edition}</GridItem>
      </>
    </AdditionalInformationTableLayout>
  )
}