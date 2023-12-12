import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useGetFileQuery} from "../../services/backend";

export const ShowFile = () => {
  const file_id = useSelector((state: RootState) => state.ui.reader.activeTab)
  const {data} = useGetFileQuery(file_id)
  return (
    <div>
      {data.file_name}
    </div>
  )
}