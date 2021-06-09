import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

export function withSRRAuth<P>(fn: GetServerSideProps<P>){
  
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const { 'dashgo.token': token } = parseCookies(ctx);
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'dashgo.token');
        destroyCookie(ctx, 'dashgo.refreshToken');
        
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
      // Fazer outra coisa
    }
  }
}