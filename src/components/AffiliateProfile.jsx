// pages/AffiliateProfile.js
import { useAuth } from "../hooks/useAuth";
import AffiliatePersonalInfo from "./AffiliateInner/AffiliatePersonalInfo";
import AffiliateSettingsForm from "./AffiliateInner/AffiliateSettingsForm";
import WithdrawBalance from "./AffiliateInner/WithdrawBalance";
import { hasPermission, hasAnyPermission } from "../Utils/permissions";
const AffiliateProfile = () => {
  const { affiliateInfo, user } = useAuth();

  if (!affiliateInfo) return <div>Loading...</div>;

  // console.log(affiliateInfo);
  const userPermissions = user?.designation?.permissions || [];

  const canViewProfile =
    user?.role === "superAdmin" ||
    user?.id === affiliateInfo?.id ||
    affiliateInfo?.id === user?.id ||
    hasPermission(userPermissions, "affiliate_view_affiliate_profile");

  const canViewWithdrawBalance =
    user?.role === "superAdmin" ||
    hasPermission(userPermissions, "affiliate_view_withdrawable_balance");

  const canManageAffiliateSettings =
    user?.role === "superAdmin" ||
    user?.id === affiliateInfo?.id ||
    affiliateInfo?.id === user?.id ||
    hasPermission(userPermissions, "affiliate_edit_affiliate");

  return (
    <div className="p-0 space-y-6">
      {canViewProfile && <AffiliatePersonalInfo info={affiliateInfo} />}

      {canViewWithdrawBalance && <WithdrawBalance info={affiliateInfo} />}

      {canManageAffiliateSettings && (
        <AffiliateSettingsForm info={affiliateInfo} />
      )}
    </div>
  );
};

export default AffiliateProfile;
