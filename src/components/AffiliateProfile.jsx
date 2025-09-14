// pages/AffiliateProfile.js
import { useAuth } from "../hooks/useAuth";
import AffiliatePersonalInfo from "./AffiliateInner/AffiliatePersonalInfo";
import AffiliateSettingsForm from "./AffiliateInner/AffiliateSettingsForm";
import WithdrawBalance from "./AffiliateInner/WithdrawBalance";
import { hasPermission } from "../Utils/permissions";
import { staticAffiliatePermission } from "../Utils/staticAffiliatePermission"; // Import staticAffiliatePermission

const AffiliateProfile = () => {
  const { affiliateInfo, user } = useAuth();

  if (!affiliateInfo) return <div>Loading...</div>;

  const isSuperAdmin = user?.role === "superAdmin";
  const userPermissions = user?.designation?.permissions || [];

  // Check if the logged-in user is a super-affiliate viewing their sub-affiliate
  // Assuming affiliateInfo has a 'superAffiliateId' field that links to its parent.
  const isSuperAffiliateViewingSubAffiliate =
    affiliateInfo?.role === "affiliate" && // The profile being viewed is a sub-affiliate
    user?.role === "superAffiliate" && // The logged-in user is a super-affiliate
    affiliateInfo?.superAffiliateId === user?.id; // The logged-in user is the super-affiliate of this sub-affiliate

  // Condition for self-view
  const isSelfViewing = user?.id === affiliateInfo?.id;

  // Permissions for viewing different sections
  const canViewProfile =
    isSuperAdmin ||
    isSelfViewing ||
    staticAffiliatePermission(user.role,userPermissions,"affiliate_view_affiliate_profile");

  const canViewWithdrawBalance =
    !isSuperAffiliateViewingSubAffiliate && // Cannot view if super-affiliate viewing sub-affiliate
    (isSuperAdmin ||
      isSelfViewing ||
      hasPermission(userPermissions, "affiliate_view_withdrawable_balance"));

  const canManageAffiliateSettings =
    !isSuperAffiliateViewingSubAffiliate && // Cannot manage if super-affiliate viewing sub-affiliate
    (isSuperAdmin ||
      isSelfViewing ||
      hasPermission(userPermissions, "affiliate_edit_affiliate"));

  // console.log({ affiliateInfo, user, isSuperAffiliateViewingSubAffiliate, canViewProfile, canViewWithdrawBalance, canManageAffiliateSettings });

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
