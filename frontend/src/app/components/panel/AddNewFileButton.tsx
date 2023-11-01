import {IconDocAdd} from "@consta/uikit/IconDocAdd";
import {Text} from "@consta/uikit/Text";
import {FileField} from "@consta/uikit/FileField";
import React, {ChangeEvent} from "react";

export const AddNewFileButton = () => {
  const handleChange = (e: ChangeEvent<Element> | DragEvent) => {
    console.log(e.target.files[0])
  }
  return <FileField id="addFileDialog" onChange={handleChange}>
            <IconDocAdd className="my-auto" size={'xs'}/><Text className="ms-2" size={"s"}>Добавить с ПК</Text>
          </FileField>
}