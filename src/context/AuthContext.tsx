import { createContext, ReactNode } from 'react'

type SignCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials): Promise<void>
  isAuthenticate: boolean;
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps){
  const isAuthenticate = false;
  async function signIn({ email, password }: SignCredentials){
    console.log(email, password)
  }

  return (
    <AuthContext.Provider value={{isAuthenticate, signIn}}>
      {children}
    </AuthContext.Provider>
  )
}