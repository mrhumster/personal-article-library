import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {NewUnspecifiedArticleForm} from "./NewUnspecifiedArticleForm";
import {NewBookArticleForm} from "./NewBookArticleForm.tsx";
import {NewJournalArticleForm} from "./NewJournalArticleForm.tsx";
import {NewWebArticleForm} from "./NewWebArticleForm.tsx";
import {NewNewspaperArticleForm} from "./NewNewspaperArticleForm.tsx";
import {NewStatuteArticleForm} from "./NewStatuteArticleForm.tsx";
import {NewEncyclopediaArticleForm} from "./NewEncyclopediaArticleForm.tsx";
import {NewDissertationArticleForm} from "./NewDissertationArticleForm.tsx";
import {NewWorkingPaperArticleForm} from "./NewWorkingPaperArticleForm.tsx";


export const getFormByReferenceType = () => {
  const reference_type = useSelector((state: RootState) => state.articles.new_article?.reference_type)
  switch (reference_type) {
    case 0:
      return <NewUnspecifiedArticleForm />
    case 1:
      return <NewBookArticleForm />
    case 2:
      return <NewJournalArticleForm />
    case 3:
      return <NewWebArticleForm />
    case 4:
      return <NewNewspaperArticleForm />
    case 5:
      return <NewStatuteArticleForm />
    case 6:
      return <NewEncyclopediaArticleForm />
    case 7:
      return <NewDissertationArticleForm />
    case 8:
      return <NewWorkingPaperArticleForm />
  }
}