import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  CityField, DayField, DescriptionField, MonthField,
  PagesField, PublicationTitleField,
  TitleField, YearField
} from "./fields";

export const NewNewspaperArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <PublicationTitleField />
      <YearField />
      <PagesField />
      <CityField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}