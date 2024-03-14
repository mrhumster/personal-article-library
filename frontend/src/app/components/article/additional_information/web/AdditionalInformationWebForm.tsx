import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {MonthField, DayField} from "../fields";

export const AdditionalInformationWebForm = () => {

  return (
    <Grid className={'p-3'} cols={1} rowGap={'m'} colGap={'m'}>
      <DayField />
      <MonthField />
    </Grid>
  )
}