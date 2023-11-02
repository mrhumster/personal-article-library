import React from "react";
import {Card} from "@consta/uikit/Card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {Button} from "@consta/uikit/Button";
import {IconClose} from "@consta/uikit/IconClose";
import { Attachment } from '@consta/uikit/Attachment';

import {closeUploadProgress} from "../../features/ui";

export const UploadProgress = () => {
  const uploadProgress = useSelector((state: RootState) => state.ui.uploadProgress)
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(closeUploadProgress())
  }
  return (
    <>
      {uploadProgress.show && !uploadProgress.error &&
          <Card verticalSpace="xs" horizontalSpace="xs" shadow={true} border status={uploadProgress.success? 'success': undefined}
                className="absolute right-0 bottom-0 m-3 w-96 bg-zinc-800">
              <div className="absolute top-0 right-0 m-2">
                  <Button iconLeft={IconClose} size='xs' view='ghost' form="round" onClick={handleClick}/>
              </div>
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