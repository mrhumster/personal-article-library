import React from "react";

export const AdditionalInformationTableLayout = ({children} : {children: JSX.Element}) => {
  return (
    <div className={'grid grid-cols-[30%_70%] gap-2 text-sm py-1 ps-1 text-m pb-3'}>
      {children}
    </div>
  )
}