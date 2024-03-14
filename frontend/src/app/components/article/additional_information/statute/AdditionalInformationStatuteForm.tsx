import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {CodeField, CountryField, DayField, MonthField, SourceField, NumberField} from "../fields";


export const AdditionalInformationStatuteForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <SourceField />
      <CountryField />
      <NumberField />
      <CodeField />
      <MonthField />
      <DayField />
    </Grid>
  )
}