import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {PagesField, VolumeField, YearField} from "./fields";

export const PubDetailsBookForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <YearField />
      <PagesField />
      <VolumeField />
    </Grid>
  )
}