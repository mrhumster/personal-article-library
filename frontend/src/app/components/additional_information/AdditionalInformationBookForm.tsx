import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {EditionField} from "./fields/EditionField.tsx";
import {EditorsField} from "./fields/EditorsField.tsx";
import {CityField} from "./fields/CityField.tsx";
import {PublisherField} from "./fields/PublisherField.tsx";
import {MonthField} from "./fields/MonthField.tsx";
import {DayField} from "./fields/DayField.tsx";


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