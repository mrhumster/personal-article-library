import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {EditionField} from "./fields/EditionField.tsx";
import {EditorsField} from "./fields/EditorsField.tsx";


export const AdditionalInformationBookForm = () => {

  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <EditionField />
      <EditorsField />
    </Grid>
  )
}