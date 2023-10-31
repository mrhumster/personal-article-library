import {SnackBar, SnackBarItemStatus} from '@consta/uikit/SnackBar';
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {Item, removeMessage} from "../../features/alert";
import {IconAlert} from "@consta/uikit/IconAlert";
import {IconRing} from "@consta/uikit/IconRing";
import {IconComponent} from "@consta/uikit/Icon";

const mapIconByStatus: Record<SnackBarItemStatus, IconComponent | undefined> = {
  alert: IconAlert,
  normal: IconRing,
  system: undefined,
  success: undefined,
  warning: undefined,
};

const getItemIcon = (item: Item): IconComponent | undefined => mapIconByStatus[item.status];
const getItemShowProgress = (item: Item) => item.progressMode;


export const SnackBarStatus: React.FC = () => {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.snackBar)

  return (

      <SnackBar className="absolute right-0 bottom-0 mb-2"
        items={items}
        onItemClose={(item) => dispatch(removeMessage(item))}
        getItemShowProgress={getItemShowProgress}
        getItemIcon={getItemIcon}
        getItemAutoClose={() => 4}
      />

  )
};
