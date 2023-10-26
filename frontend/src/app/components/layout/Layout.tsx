import React from 'react';
import {Header} from "../header";

export const Layout =({children} : {children: JSX.Element}) =>{
    return(
        <div className="h-screen bg-white-900">
          <Header />
          <main className="w-11/12 h-screen ms-16">{children}</main>
        </div>
    )
}