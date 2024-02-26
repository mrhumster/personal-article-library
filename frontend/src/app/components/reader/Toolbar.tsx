import {ToolbarProps, ToolbarSlot} from "@react-pdf-viewer/default-layout";
import React, {ReactElement} from "react";
import {OpenRightSideBar} from "./buttons";

export const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
    <Toolbar>
      {(slots: ToolbarSlot) => {
        const {
          CurrentPageLabel,
          Download,
          EnterFullScreen,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          Print,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;
        return (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              width: '100%',
            }}
          >
            <div style={{padding: '0px 2px', marginLeft: '5px'}}>
              <OpenRightSideBar/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <Print/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <Download/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <EnterFullScreen/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <ShowSearchPopover/>
            </div>
            <div style={{padding: '0px 2px', marginLeft: 'auto'}}>
              <ZoomOut/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <Zoom/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <ZoomIn/>
            </div>
            <div style={{padding: '0px 2px', marginLeft: 'auto'}}>
              <GoToPreviousPage/>
            </div>
            <div style={{padding: '0px 2px'}} className={'flex text-zinc-100'}>
              <CurrentPageLabel/> / <NumberOfPages/>
            </div>
            <div style={{padding: '0px 2px'}}>
              <GoToNextPage/>
            </div>
          </div>
        );
      }}
    </Toolbar>
  );