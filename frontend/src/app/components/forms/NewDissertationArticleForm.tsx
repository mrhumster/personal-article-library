import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {
  AuthorsField,
  DayField,
  DepartmentField,
  DescriptionField,
  InstitutionField,
  MonthField,
  PagesField,
  TitleField,
  TypeField,
  YearField
} from "./fields";



export const NewDissertationArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
      <YearField />
      <PagesField />
      <InstitutionField />
      <DepartmentField />
      <TypeField />
      <DayField />
      <MonthField />
      <DescriptionField />
    </Grid>
  )
}