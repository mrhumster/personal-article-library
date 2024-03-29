import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  DayField, DescriptionField,
  IssueField, MonthField,
  PagesField, PublicationTitleField, TitleField,
  VolumeField,
  YearField
} from "./fields";


export const NewJournalArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <PublicationTitleField />
      <YearField />
      <PagesField />
      <VolumeField />
      <IssueField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}