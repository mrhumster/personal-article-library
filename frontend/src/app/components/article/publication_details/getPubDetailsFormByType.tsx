import React from "react";
import {
  PubDetailsBookForm, PubDetailsDissertationForm, PubDetailsEncyclopediaForm,
  PubDetailsJournalForm,
  PubDetailsMagazineForm, PubDetailsStatuteForm,
  PubDetailsUnspecifiedForm,
  PubDetailsWebForm, PubDetailsWorkingPaperForm
} from "./forms";

export const getPubDetailsFormByType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return <PubDetailsUnspecifiedForm />
    case 1:
      return <PubDetailsBookForm />
    case 2:
      return <PubDetailsJournalForm />
    case 3:
      return <PubDetailsWebForm />
    case 4:
      return <PubDetailsMagazineForm />
    case 5:
      return <PubDetailsStatuteForm />
    case 6:
      return <PubDetailsEncyclopediaForm />
    case 7:
      return <PubDetailsDissertationForm />
    case 8:
      return <PubDetailsWorkingPaperForm />
  }
}