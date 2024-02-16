import React from "react";
import {PubDetailsBookForm, PubDetailsUnspecifiedForm} from "./forms";

export const getPubDetailsFormByType = (reference_type: number | undefined) => {
  switch (reference_type) {
    case 0:
      return <PubDetailsUnspecifiedForm />
    case 1:
      return <PubDetailsBookForm />
  }
}