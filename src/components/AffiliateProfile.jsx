// pages/AffiliateProfile.js
import { useAuth } from "../hooks/useAuth";
import AffiliatePersonalInfo from "./AffiliateInner/AffiliatePersonalInfo";
import AffiliateSettingsForm from "./AffiliateInner/AffiliateSettingsForm";
import WithdrawBalance from "./AffiliateInner/WithdrawBalance";

const AffiliateProfile = () => {
  const { affiliateInfo, user } = useAuth();

  if (!affiliateInfo) return <div>Loading...</div>;

  console.log(affiliateInfo);
  const isShow =
    user?.role === "admin" ||
    user?.role === "superAdmin" ||
    user?.id === affiliateInfo?.id ||
    affiliateInfo?.id === user?.id;
  return (
    <div className="p-0 space-y-6">
      <AffiliatePersonalInfo info={affiliateInfo} />

      {isShow && (
        <>
          <WithdrawBalance info={affiliateInfo} />
          <AffiliateSettingsForm info={affiliateInfo} />
        </>
      )}
    </div>
  );
};

export default AffiliateProfile;
