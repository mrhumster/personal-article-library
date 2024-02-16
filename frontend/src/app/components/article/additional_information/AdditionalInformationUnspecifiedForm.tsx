import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {EditionField} from "./fields";


export const AdditionalInformationUnspecifiedForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <EditionField />
    </Grid>
  )
}