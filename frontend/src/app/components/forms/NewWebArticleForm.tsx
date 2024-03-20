import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  DayField, DescriptionField,
  MonthField,
  PagesField, PublicationTitleField,
  TitleField,
  YearField
} from "./fields";

export const NewWebArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <PublicationTitleField />
      <YearField />
      <PagesField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}