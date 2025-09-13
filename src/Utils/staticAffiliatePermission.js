import { hasPermission } from "./permissions";

export function staticAffiliatePermission(userRole, permissionList, permissionKey) {
  if (userRole === "superAdmin" || userRole === "affiliate" || userRole === "superAffiliate") {
    return true;
  }
  return hasPermission(permissionList, permissionKey) || false;
}


export function staticAdminPermission(userRole, permissionList, permissionKey) {
  if (userRole === "superAdmin") {
    return true;
  }
  return hasPermission(permissionList, permissionKey) || false;
}

export function staticAdminCheck(userRole) {
  return userRole === "admin" || userRole === "superAdmin";
}