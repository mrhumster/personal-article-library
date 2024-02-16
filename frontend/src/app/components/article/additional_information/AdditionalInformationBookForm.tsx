import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {EditionField, EditorsField, CityField, PublisherField, MonthField, DayField} from "./fields";

export const AdditionalInformationBookForm = () => {

  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <EditionField />
      <EditorsField />
      <CityField />
      <PublisherField />
      <DayField />
      <MonthField />
    </Grid>
  )
}