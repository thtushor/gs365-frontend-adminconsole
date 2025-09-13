import { hasPermission } from "./permissions";

export function staticAffiliatePermission(userRole, permissionList, permissionKey) {
  if (userRole === "superAdmin" || userRole === "affiliate" || userRole === "superAffiliate") {
    return true;
  }
  return hasPermission(permissionList, permissionKey) || false;
}
