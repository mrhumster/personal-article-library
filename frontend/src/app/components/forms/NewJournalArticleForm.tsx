import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {TitleField} from "./fields";

export const NewJournalArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
    </Grid>
  )
}