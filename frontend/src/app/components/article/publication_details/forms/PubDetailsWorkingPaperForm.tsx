import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {PagesField, YearField} from "./fields";

export const PubDetailsWorkingPaperForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <YearField />
      <PagesField />
    </Grid>
  )
}