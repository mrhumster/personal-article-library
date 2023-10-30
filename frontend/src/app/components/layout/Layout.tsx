import React from 'react';
import {Header} from "../header";
import {RootState} from "../../store/store.ts";
import { useSelector } from 'react-redux'


export const Layout =({children} : {children: JSX.Element}) => {
  const auth = useSelector((state: RootState) => state.auth)
  return (
    <div className="h-screen dark:bg-zinc-800 bg-white-900">
      { auth.isLogin && <Header/>}
      <main className="h-screen ms-16">{children}</main>
    </div>
  )
}