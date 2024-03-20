import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField, CityField, DayField, DescriptionField,
  IssueField, MonthField,
  PagesField,
  PublicationTitleField, PublisherField,
  TitleField, TypeField,
  VolumeField,
  YearField
} from "./fields";

export const NewUnspecifiedArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <PublicationTitleField />
      <YearField />
      <PagesField />
      <VolumeField />
      <IssueField />
      <CityField />
      <PublisherField />
      <TypeField />
      <MonthField />
      <DayField />
      <DescriptionField />
    </Grid>
  )
}