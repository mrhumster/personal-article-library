import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  CodeField,
  CountryField,
  DayField,
  DescriptionField,
  MonthField,
  NumberField,
  PagesField,
  PublicationTitleField,
  SourceField,
  TitleField,
  YearField
} from "./fields";

export const NewStatuteArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <PublicationTitleField />
      <YearField />
      <PagesField />
      <SourceField />
      <CountryField />
      <NumberField />
      <CodeField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}