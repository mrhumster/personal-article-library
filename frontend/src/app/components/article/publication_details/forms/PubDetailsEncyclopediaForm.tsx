import {Grid} from "@consta/uikit/Grid";
import React from "react";
import {PagesField, TitleField, VolumeField, YearField} from "./fields";

export const PubDetailsEncyclopediaForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <YearField />
      <PagesField />
      <VolumeField />
    </Grid>
  )
}