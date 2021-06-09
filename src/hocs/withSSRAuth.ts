import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import decode from "jwt-decode";
import { validateUserPermission } from "../utils/validateUserPermissions";

type WithSRRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

export function withSRRAuth<P>(fn: GetServerSideProps<P>, options?: WithSRRAuthOptions){
  
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

    // Pemission on ssr
    if (options) {
      const { permissions, roles } = options;
      const user = decode<{ permissions: string[], roles: string[] }>(token);
      const userHasValidPermissions = validateUserPermission({
        user,
        permissions,
        roles
      });

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          }
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