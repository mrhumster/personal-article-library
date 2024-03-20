import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  CityField,
  DayField,
  DescriptionField,
  InstitutionField,
  MonthField,
  NumberField,
  PagesField,
  SeriesField,
  TitleField,
  YearField
} from "./fields";


export const NewWorkingPaperArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <YearField />
      <PagesField />
      <CityField />
      <InstitutionField />
      <NumberField />
      <SeriesField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}