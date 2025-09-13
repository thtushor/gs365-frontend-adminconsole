export function staticAffiliatePermission(userRole) {
  if (userRole === "superAdmin" || userRole === "admin") {
    return true;
  }
  return false;
}
