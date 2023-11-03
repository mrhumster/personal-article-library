import React, {useEffect} from "react";
import {Card} from "@consta/uikit/Card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import { Attachment } from '@consta/uikit/Attachment';

import {closeUploadProgress} from "../../features/ui";
import {CloseButton} from "../buttons";
import {useGetArticlesQuery} from "../../services/backend";

export const UploadProgress = () => {
  const uploadProgress = useSelector((state: RootState) => state.ui.uploadProgress)
  useSelector((state: RootState) => state.ui.rightSideBar.isSidebarOpen);
  const { refetch } = useGetArticlesQuery({})
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(closeUploadProgress())
  }

  useEffect(() => {
    if (uploadProgress.success) {
      refetch()
    }
  }, [uploadProgress.success])

  return (
    <>
      {uploadProgress.show && !uploadProgress.error &&
          <Card verticalSpace="xs" horizontalSpace="xs" shadow={true} border status={uploadProgress.success? 'success': undefined}
                className="absolute right-0 bottom-0 m-3 w-96 bg-zinc-800 z-50">
              <CloseButton callback={handleClick} />
              {uploadProgress.file &&
                  <div className="me-3 select-none">
                  <Attachment fileExtension={uploadProgress.file.extension}
                              fileName={uploadProgress.file.name}
                              fileDescription={uploadProgress.file.description}
                              loading={uploadProgress.loading}
                  />
                  </div>
              }
          </Card>
      }
    </>
  )
}