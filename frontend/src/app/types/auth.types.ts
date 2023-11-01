export interface UserResponse {
  id: string,
  email: string,
  username: string,
  fullName: string,
  disabled: boolean,
  theme: string
}

export interface UserIFace {
  username: string,
  password: string,
  email: string,
  fullName: string,
  disabled: boolean,
  theme: string
}

export interface AuthState {
  username: string | undefined,
  email: string | undefined,
  fullName: string | undefined
  isExists: boolean | undefined,
  isLogin: boolean
}


export interface UserDataIFace {
    access: string,
    refresh: string,
    user: UserIFace
}