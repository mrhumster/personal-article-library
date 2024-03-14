import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {MonthField, DayField, CityField} from "../fields";

export const AdditionalInformationMagazineForm = () => {

  return (
    <Grid className={'p-3'} cols={1} rowGap={'m'} colGap={'m'}>
      <CityField />
      <DayField />
      <MonthField />
    </Grid>
  )
}