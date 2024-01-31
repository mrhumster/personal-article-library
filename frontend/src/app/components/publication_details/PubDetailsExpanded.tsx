import React, {forwardRef} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {getPubDetailsFormByType} from "./getPubDetailsFormByType.tsx";

export const PubDetailsExpanded = forwardRef<HTMLDivElement>(function PubDetailsExpanded(_, ref) {
  const type = useSelector((state: RootState) => state.articles.current_article?.reference_type)
  const pubDetailsForm = getPubDetailsFormByType(type)
  return (
    <div ref={ref} className="border rounded border-sky-700 mb-1 mt-2 pb-2">
      {pubDetailsForm}
    </div>
  )
})