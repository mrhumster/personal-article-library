import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import './style.css'
import {Login} from "./app/pages";


const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login/>
    },
  ],{
    basename: "/"
  }
)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme preset={presetGpnDefault}>
      <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>,
)