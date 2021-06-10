import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "../errors/AuthTokenError";

let isRefreshing = false;
let failedRequestQueue = [];

// Para conseguir realizar as requisitoes tanto no client quanto no servidor
export function setupAPIClient(ctx = undefined){
  const cookies = parseCookies(ctx);

  const api = axios.create({
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
        const { 'dashgo.refreshToken': refreshToken } = parseCookies(ctx);
        const originalConfig = error.config;
        if (!isRefreshing) {
          isRefreshing = true;
          api.post('/refresh', {
            refreshToken
          }).then(res => {
            const { token } = res.data;
    
            setCookie(ctx, 'dashgo.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            });
      
            setCookie(ctx, 'dashgo.refreshToken', res.data.refreshToken,  {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            });
    
            api.defaults.headers["Authorization"] = `Bearer ${token}`
            
            failedRequestQueue.forEach(req => req.onSuccess(token));
          }).catch(err => {
            failedRequestQueue.forEach(req => req.onFailure(err));
  
            if (process.browser) {
              signOut();
            } else {
              return Promise.reject(new AuthTokenError());
            }
          }).finally(() => {
            isRefreshing =  false;
            failedRequestQueue = [];
          });
        }
  
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            }
          })
        });
      } else {
        if (process.browser) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
    }
  
    return Promise.reject(error);
  })

  return api;
}