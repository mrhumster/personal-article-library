import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {PagesField, TitleField, YearField} from "./fields";

export const PubDetailsStatuteForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <YearField />
      <PagesField />
    </Grid>
  )
}