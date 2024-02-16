import React from "react";
import {AdditionalInformationBookTable} from "./AdditionalInformationBookTable.tsx";
import {AdditionalInformationUnspecifiedTable} from "./AdditionalInformationUnspecifiedTable.tsx";

export const getAdditionInformationTableByType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return <AdditionalInformationUnspecifiedTable />
    case 1:
      return <AdditionalInformationBookTable />
  }
}