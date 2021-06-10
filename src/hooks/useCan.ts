import { useAuth } from "../contexts/AuthContext"
import { validateUserPermission } from "../utils/validateUserPermissions";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions = [], roles = [] }: UseCanParams){
  const { isAuthenticate, user } = useAuth();

  if (!isAuthenticate) {
    return false;
  }

  const userHasValidPermissions = validateUserPermission({
    user,
    permissions,
    roles
  })
  return userHasValidPermissions;
}