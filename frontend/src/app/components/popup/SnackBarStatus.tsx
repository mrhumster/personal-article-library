import {SnackBar, SnackBarItemDefault, SnackBarItemStatus} from '@consta/uikit/SnackBar';
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {removeMessage} from "../../features/alert";
import {IconAlert} from "@consta/uikit/IconAlert";
import {IconRing} from "@consta/uikit/IconRing";

const mapIconByStatus = {
  alert: IconAlert,
  normal: IconRing,
  system: undefined,
  success: undefined,
  warning: undefined,
};

const getIconByStatus = (status: SnackBarItemStatus | undefined) => {
  if (!status) {
    return undefined
  } else {
    return mapIconByStatus[status]
  }
}

const getItemIcon = (item: SnackBarItemDefault) => getIconByStatus(item.status);
const getItemShowProgress = (item: SnackBarItemDefault) => item.showProgress;


export const SnackBarStatus: React.FC = () => {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.snackBar)

  return (

      <SnackBar className="absolute right-0 bottom-0 mb-2 z-40"
        items={items}
        onItemClose={(item) => dispatch(removeMessage(item))}
        getItemShowProgress={getItemShowProgress}
        getItemIcon={getItemIcon}
        getItemAutoClose={() => 4}
      />

  )
};
