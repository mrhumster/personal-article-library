import React from "react";
import {Grid} from "@consta/uikit/Grid";
import {AuthorsField, TitleField} from "./fields";

export const NewBookArticleForm = () => {
  return (
    <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
      <TitleField />
      <AuthorsField />
    </Grid>
  )
}