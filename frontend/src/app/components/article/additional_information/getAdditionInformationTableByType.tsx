import React from "react";
import {AdditionalInformationUnspecifiedTable} from "./unspecified";
import {AdditionalInformationBookTable} from "./book";
import {AdditionalInformationJournalTable} from "./journal";
import {AdditionalInformationWebTable} from "./web";
import {AdditionalInformationMagazineTable} from "./magazine";
import {AdditionalInformationStatuteTable} from "./statute";
import {AdditionalInformationEncyclopediaTable} from "./encyclopedia";
import {AdditionalInformationDissertationTable} from "./dissertation";
import {AdditionalInformationWorkingPaperTable} from "./working_paper";


export const getAdditionInformationTableByType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return <AdditionalInformationUnspecifiedTable />
    case 1:
      return <AdditionalInformationBookTable />
    case 2:
      return <AdditionalInformationJournalTable />
    case 3:
      return <AdditionalInformationWebTable />
    case 4:
      return <AdditionalInformationMagazineTable />
    case 5:
      return <AdditionalInformationStatuteTable />
    case 6:
      return <AdditionalInformationEncyclopediaTable />
    case 7:
      return <AdditionalInformationDissertationTable />
    case 8:
      return <AdditionalInformationWorkingPaperTable />
  }
}