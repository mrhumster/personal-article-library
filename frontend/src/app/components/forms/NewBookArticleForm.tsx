import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  CityField, DayField,
  EditionField,
  EditorsField, MonthField,
  PagesField, PublisherField,
  TitleField,
  VolumeField,
  YearField
} from "./fields";


export const NewBookArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <YearField />
      <PagesField />
      <VolumeField />
      <EditionField />
      <EditorsField />
      <CityField />
      <PublisherField />
      <DayField />
      <MonthField />
    </Grid>
  )
}