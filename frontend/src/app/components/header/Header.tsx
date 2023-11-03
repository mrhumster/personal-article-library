import React from 'react'
import { IconBook } from "@consta/uikit/IconBook";
import { IconDocFilled } from "@consta/uikit/IconDocFilled";
import logo from '../../../assets/images/logo-without-text.svg'
import {HeaderButton} from "./HeaderButton.tsx";
import {UserMenu} from "./UserMenu.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {openSideBar, setActiveTab} from "../../features/ui";


export const Header = () => {
  const rightSideBar = useSelector((state: RootState) => state.ui.rightSideBar)
  const dispatch = useDispatch()
  const handlerClickLibButton = () => {
    console.log('click')
  }

  const handlerClickOpenNotebook = () => {
    dispatch(setActiveTab(2))
    dispatch(openSideBar(true))
  }

  return (
    <header className="bg-zinc-900 select-none text-white shadow-xl absolute inset-y-0 left-0 w-16 top-0 z-10">
        <section className="max-w-screen-lg h-full mx-auto p-1 flex flex-col">
          <h1 className="mb-4 mt-2 mx-auto w-6">
            <a href="#">
              <img className="mx-auto" src={logo} alt="logo"/>
            </a>
          </h1>
          <div className="flex flex-col items-center grow">
            <button id="mobile-open-button" className="text-3x1 sm:hidden focus:outline-none">&#9776;</button>
            <nav className="hidden sm:block space-y-2 text-xl flex flex-col justify-center grow" aria-label="main">
              <HeaderButton text="Библиотека" icon={IconBook} active={true} callback={handlerClickLibButton}/>
              <HeaderButton text="Блокнот"
                            icon={IconDocFilled}
                            active={rightSideBar.isSidebarOpen && rightSideBar.activeTab === 2}
                            callback={handlerClickOpenNotebook}
              />
            </nav>
            <nav className="flex flex-col mb-1">
              <UserMenu />
            </nav>
          </div>
        </section>
      </header>
  )
}