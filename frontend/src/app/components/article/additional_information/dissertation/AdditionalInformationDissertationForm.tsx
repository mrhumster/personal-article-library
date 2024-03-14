import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {CityField, MonthField, DayField, InstitutionField, DepartamentField, TypeField} from "../fields";

export const AdditionalInformationDissertationForm = () => {

  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <CityField />
      <InstitutionField />
      <DepartamentField />
      <TypeField />
      <DayField />
      <MonthField />
    </Grid>
  )
}