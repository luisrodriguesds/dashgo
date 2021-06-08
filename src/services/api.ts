import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

const cookies = parseCookies()
export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies["dashgo.token"]}`
  }
});

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === 'token.expired') {
      // Realizar refreshing token
      const { 'dashgo.refreshToken': refreshToken } = parseCookies();
      api.post('/refresh', {
        refreshToken
      }).then(res => {
        const { token } = res.data;

        setCookie(undefined, 'dashgo.token', token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/'
        });
  
        setCookie(undefined, 'dashgo.refreshToken', res.data.refreshToken,  {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/'
        });

        api.defaults.headers["Authorization"] = `Bearer ${token}`

      })
    }else {
      // deslogar usuário
    }
  }
})