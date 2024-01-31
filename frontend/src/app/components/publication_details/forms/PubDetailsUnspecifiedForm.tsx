import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {IssueField, PagesField, TitleField, VolumeField, YearField} from "./fields";

export const PubDetailsUnspecifiedForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <YearField />
      <PagesField />
      <VolumeField />
      <IssueField />
    </Grid>
  )
}