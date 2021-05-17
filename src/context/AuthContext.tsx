import Router from 'next/router';
import { createContext, ReactNode, useState } from 'react'
import { api } from '../services/api';

type SignCredentials = {
  email: string;
  password: string;
}

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type AuthContextData = {
  signIn(credentials): Promise<void>
  isAuthenticate: boolean;
  user: User
}

type AuthProviderProps = {
  children: ReactNode
}


export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticate = !!user;
  async function signIn({ email, password }: SignCredentials){
    try {
      const res = await api.post('/sessions', {
        email, password
      })
      
      const { permissions, roles } = res.data
      setUser({
        email,
        permissions,
        roles
      })
      Router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{isAuthenticate, signIn, user}}>
      {children}
    </AuthContext.Provider>
  )
}