import React from 'react'
import {AdditionalInformationBookForm} from "./AdditionalInformationBookForm.tsx";
import {AdditionalInformationUnspecifiedForm} from "./AdditionalInformationUnspecifiedForm.tsx";

export const getAdditionInformationFormByType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return <AdditionalInformationUnspecifiedForm />
    case 1:
      return <AdditionalInformationBookForm />
  }
}