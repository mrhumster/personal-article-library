import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { Theme, presetGpnDark } from '@consta/uikit/Theme';
import './style.css'
import {Login} from "./app/pages";
import { store } from './app/store'
import { Provider } from 'react-redux'
import {WorkSpace} from "./app/pages/WorkSpace.tsx";
import {ProtectedRoute} from "./app/routes/ProtectedRoute.tsx";

const router = createBrowserRouter(
  [{
            path: '/login',
            element: <Login/>
          },
          {
            path: '/',
            element: <ProtectedRoute><WorkSpace /></ProtectedRoute>
          }],
  {
    basename: "/"
  }
)
ReactDOM.createRoot(document.getElementById('root')!).render(

    <Theme preset={presetGpnDark}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Theme>
)