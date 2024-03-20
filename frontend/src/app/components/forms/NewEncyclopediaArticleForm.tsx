import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  CityField,
  DayField,
  DescriptionField,
  EditionField,
  EditorsField,
  MonthField,
  PagesField,
  PublicationTitleField,
  PublisherField,
  TitleField,
  VolumeField,
  YearField
} from "./fields";

export const NewEncyclopediaArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <PublicationTitleField />
      <YearField />
      <PagesField />
      <VolumeField />
      <EditionField />
      <EditorsField />
      <CityField />
      <PublisherField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}