import Router from 'next/router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { setCookie, parseCookies, destroyCookie  } from "nookies";

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
  signIn(credentials): Promise<void>;
  signOut: () => void;
  isAuthenticate: boolean;
  user: User
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut(){
  destroyCookie(undefined, 'dashgo.token');
  destroyCookie(undefined, 'dashgo.refreshToken');

  authChannel.postMessage('signOut');

  Router.push('/');
} 


export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticate = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');
    authChannel.onmessage = (message) => {
      console.log(message.data)

      switch (message.data) {
        case 'signOut':
          // Checkar para não entrar em loop
          if (Router.pathname !== '/') {
            signOut();
            console.log("sair");
          }
          break;
        case 'signIn':
          // if (Router.pathname === '/') {
          //   console.log("entrar");

          //   Router.push('/dashboard');
          // }
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    const { 'dashgo.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;
        setUser({ email, permissions, roles })
      }).catch(() => {
        signOut()
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

      
      Router.push('/dashboard');

      setTimeout(() => {
        authChannel.postMessage('signIn');
      }, 1000)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{isAuthenticate, signIn, user, signOut}}>
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