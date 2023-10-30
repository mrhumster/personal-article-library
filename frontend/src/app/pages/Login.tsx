import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import { TextField } from '@consta/uikit/TextField';
import { User } from '@consta/uikit/User';
import { IconClose } from '@consta/icons/IconClose'
import {Layout} from "../components";
import logo from '../../assets/images/logo-without-text-blue.png'
import { Button } from '@consta/uikit/Button';
import {
  clearAuthData,
  setUsername as setUsernameAction,
  useCheckUsernameQuery,
  useGetTokenMutation
} from "../features/auth/authSlice.ts";
import {RootState} from "../store/store.ts";
import {getUser} from "../hooks/user.actions.ts";
import {useNavigate} from "react-router-dom";
import {Text} from "@consta/uikit/Text";


export const Login = () => {
  const [username, setUsername] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const user = getUser()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const { refetch } = useCheckUsernameQuery(auth.username, { skip: !auth.username})
  const [getToken, loginResult] = useGetTokenMutation()
  const handleChangeUsername = ({ value }: { value: string | null }) => setUsername(value);
  const handleChangePassword = ({ value }: { value: string | null }) => setPassword(value);
  const handleClickOtherUser = () => {
    setUsername(null)
    setPassword(null)
    dispatch(clearAuthData())
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>):void => {
    event.preventDefault()
    if (auth.isExists === undefined) {
      // Stage 1: set login
      dispatch(setUsernameAction(username))
    } else if (auth.isExists) {
      // Stage 2: set password and get token
      getToken({username: username, password: password})
    }
  }

  useEffect(() => {
    if (auth.username) {
      refetch()
    }
  }, [auth.username])

  if (user) {navigate('/')}

  return (
    <Layout>
      <div className="flex h-full w-full justify-center items-center">
        <div
          className="w-96 h-96 dark:bg-zinc-800 bg-gray-100 border dark:border-zinc-900 rounded dark:shadow-zinc-900 shadow-xl">
          <form className='flex flex-col justify-center items-center' onSubmit={handleSubmit}>
            <img src={logo} alt="logo" className={auth.isExists? 'mt-4 w-16': 'mt-4 w-24'}/>
            <h3 className="text-2xl text-zinc-300 p-3">Библиотека</h3>
            {auth.isExists && auth.email &&
                <User className='mb-5'
                      name={auth.username}
                      info={auth.email}
                      view = "ghost"
                      iconRight={IconClose}
                      onIconRightClick={handleClickOtherUser}
                />
            }
            {auth.isExists === undefined && <TextField
              className="w-64"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleChangeUsername}
              withClearButton
              required
            />}
            {auth.isExists && !auth.isLogin && <TextField
              className="w-64"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChangePassword}
              withClearButton
              required
              status={loginResult.isError? 'alert' : undefined}
            />}
            <TextField
              type="email"
            />
            {!auth.isLogin && <Button className="m-4" label="Далее" type="submit"/>}
          </form>
        </div>
      </div>
    </Layout>
  )
}