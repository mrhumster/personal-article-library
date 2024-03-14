import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {
  CityField,
  MonthField,
  DayField,
  InstitutionField,
  NumberField, SeriesField
} from "../fields";

export const AdditionalInformationWorkingPaperForm = () => {

  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <CityField />
      <InstitutionField />
      <NumberField />
      <SeriesField />
      <DayField />
      <MonthField />
    </Grid>
  )
}