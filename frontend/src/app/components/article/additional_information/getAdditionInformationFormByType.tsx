import React from 'react'
import {AdditionalInformationUnspecifiedForm} from "./unspecified";
import {AdditionalInformationBookForm} from "./book";
import {AdditionalInformationJournalForm} from "./journal";
import {AdditionalInformationWebForm} from "./web";
import {AdditionalInformationMagazineForm} from "./magazine";
import {AdditionalInformationStatuteForm} from "./statute";
import {AdditionalInformationEncyclopediaForm} from "./encyclopedia";
import {AdditionalInformationDissertationForm} from "./dissertation";
import {AdditionalInformationWorkingPaperForm} from "./working_paper";

export const getAdditionInformationFormByType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return <AdditionalInformationUnspecifiedForm />
    case 1:
      return <AdditionalInformationBookForm />
    case 2:
      return <AdditionalInformationJournalForm />
    case 3:
      return <AdditionalInformationWebForm />
    case 4:
      return <AdditionalInformationMagazineForm />
    case 5:
      return <AdditionalInformationStatuteForm />
    case 6:
      return <AdditionalInformationEncyclopediaForm />
    case 7:
      return <AdditionalInformationDissertationForm />
    case 8:
      return <AdditionalInformationWorkingPaperForm />
  }
}