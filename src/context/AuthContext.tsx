import Router from 'next/router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { setCookie, parseCookies  } from "nookies";

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

  useEffect(() => {
    const { 'dashgo.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;
        setUser({ email, permissions, roles })
      })
    }
  }, [])

  async function signIn({ email, password }: SignCredentials){
    try {
      const res = await api.post('/sessions', {
        email, password
      })
      
      const { token, refreshToken, permissions, roles } = res.data
      setUser({
        email,
        permissions,
        roles
      })

      setCookie(undefined, 'dashgo.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, 'dashgo.refreshToken', refreshToken,  {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      api.defaults.headers["Authorization"] = `Bearer ${token}`
      Router.push('/dashboard')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{isAuthenticate, signIn, user}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}