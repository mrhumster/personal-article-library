import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import { TextField } from '@consta/uikit/TextField';
import { User } from '@consta/uikit/User';
import { IconClose } from '@consta/icons/IconClose'
import { IconForward } from '@consta/icons/IconForward'
import {Layout} from "../components";
import logo from '../../assets/images/logo-without-text-blue.png'
import { Button } from '@consta/uikit/Button';
import {
  clearAuthData,
  setUsername as setUsernameAction,
  setEmail as setEmailAction,
  setFullName as setFullNameAction
} from "../features/auth"
import {RootState} from "../store";
import {getUser} from "../hooks";
import {useNavigate} from "react-router-dom";
import {useCheckUsernameQuery, useCreateUserMutation, useGetTokenMutation} from "../services/backend";
import {UserIFace} from "../types";


export const Login = () => {
  const [username, setUsername] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [rePassword, setRePassword] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)

  const [passwordError, setPasswordError] = useState<boolean>(false)

  const user = getUser()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const auth = useSelector((state: RootState) => state.auth)
  const {refetch, isLoading} = useCheckUsernameQuery(auth.username, {skip: !auth.username})
  const [getToken, loginResult] = useGetTokenMutation()
  const [createUser] = useCreateUserMutation()

  const handleChangeUsername = ({value}: { value: string | null }) => setUsername(value);
  const handleChangePassword = ({value}: { value: string | null }) => setPassword(value);
  const handleChangeRePassword = ({value}: { value: string | null }) => setRePassword(value);
  const handleChangeEmail = ({value}: { value: string | null }) => setEmail(value);
  const handleChangeFullname = ({value}: { value: string | null }) => setFullName(value);

  const handleClickOtherUser = () => {
    setUsername(null)
    setPassword(null)
    dispatch(clearAuthData())
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (auth.isExists === undefined) {
      // Stage 1: set login
      dispatch(setUsernameAction(username))
    } else if (auth.isExists && auth.username) {
      // Stage 2: set password and get token
      getToken({username: username, password: password})
    } else if (!auth.isExists && !auth.email) {
      dispatch(setEmailAction(email))
    } else if (!auth.isExists && auth.email && !auth.fullName) {
      dispatch(setFullNameAction(fullName))
    } else if (!auth.isExists && auth.email && auth.fullName && !passwordError) {
      if (auth.username && password && auth.email && auth.fullName) {
        const user: UserIFace = {
          username: auth.username,
          fullName: auth.fullName,
          password: password,
          email: auth.email,
          disabled: false,
          theme: 'dark'
        }
        createUser(user)
      }
    }
  }

  useEffect(() => {
    if (auth.username) refetch()
  }, [auth.username])

  useEffect(() => {
    if (password === rePassword && password) {
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }

  }, [password, rePassword])

  if (user) {
    navigate('/')
  }

  return (
    <Layout>
      <div className="flex h-full w-full justify-center items-center">
        <div
          className="w-96 h-96 dark:bg-zinc-800 bg-gray-100 border dark:border-zinc-900 rounded dark:shadow-zinc-900 shadow-xl">
          <form className='flex flex-col justify-center items-center' onSubmit={handleSubmit}>
            <img src={logo} alt="logo" className={auth.isExists ? 'mt-4 w-16' : 'mt-4 w-24'}/>
            <h3 className="text-2xl text-zinc-300 p-3">Библиотека</h3>
            {auth.isExists && auth.email &&
                <User className='mb-5'
                      name={auth.fullName}
                      info={auth.email}
                      view="ghost"
                      iconRight={IconClose}
                      onIconRightClick={handleClickOtherUser}
                />
            }
            {auth.isExists === undefined && <TextField
                autoFocus
                className="w-64"
                type="text"
                placeholder="Логин"
                value={username}
                onChange={handleChangeUsername}
                withClearButton
                required
            />}
            {auth.isExists && !auth.isLogin && <TextField
                autoFocus
                className="w-64"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={handleChangePassword}
                withClearButton
                required
                status={loginResult.isError ? 'alert' : undefined}
            />}
            {!auth.isExists && !auth.email && auth.username && <TextField
                autoFocus
                className="w-64"
                type="email"
                placeholder="Адрес электронной почты"
                value={email}
                onChange={handleChangeEmail}
                withClearButton
                required
            />}
            {!auth.isExists && auth.email && auth.username && !auth.fullName && <TextField
                autoFocus
                className="w-64"
                type="text"
                placeholder="Полное имя"
                value={fullName}
                onChange={handleChangeFullname}
                withClearButton
                required
            />}
            {!auth.isExists && auth.email && auth.username && auth.fullName && <>
                <TextField
                    autoFocus
                    className="w-64 m-1"
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={handleChangePassword}
                    required
                    status={passwordError ? 'alert' : undefined}
                />
                <TextField
                    className="w-64"
                    type="password"
                    placeholder="Пароль еще раз"
                    value={rePassword}
                    onChange={handleChangeRePassword}
                    required
                    status={passwordError ? 'alert' : undefined}
                />

            </>}
            {!auth.isLogin &&
                <Button className="m-4"
                        label="Далее"
                        type="submit"
                        view={'secondary'}
                        iconRight={IconForward}
                        loading={isLoading}
                        size={'s'}
                />
            }
          </form>
        </div>
      </div>
    </Layout>
  )
}