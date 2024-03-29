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
  const {refetch} = useGetArticlesQuery({})

  const dispatch = useDispatch()

  const handleClick = () => dispatch(closeUploadProgress())

  useEffect(() => {
    if (uploadProgress.success) refetch()
  }, [uploadProgress.success])

  useEffect(() => {
    if (uploadProgress.show) {
      const timer = setTimeout(() => {
        dispatch(closeUploadProgress())
      }, 5000);
      return () => clearTimeout(timer);
    }

  }, [uploadProgress.show]);

  return (
    <>
      {uploadProgress.show && !uploadProgress.error &&
          <Card verticalSpace="xs" horizontalSpace="xs" shadow={false} border
                status={uploadProgress.success ? 'normal' : undefined}
                className="absolute hover:shadow-xl hover:shadow-zinc-500/50 shadow-lg shadow-zinc-500/20 right-0 bottom-0 m-3 w-96 bg-zinc-700 z-50">
              <CloseButton callback={handleClick}/>
            {uploadProgress.file &&
                <div className="me-3">
                    <Attachment fileExtension={uploadProgress.file.extension}
                                size={'xs'}
                                fileName={uploadProgress.file.name}
                                fileDescription={uploadProgress.file.description}
                                withPictogram={true}
                                loading={uploadProgress.loading}
                    />
                </div>
            }
          </Card>
      }
    </>
  )
}