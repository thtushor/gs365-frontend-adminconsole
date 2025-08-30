// pages/AffiliateProfile.js
import { useAuth } from "../hooks/useAuth";
import AffiliatePersonalInfo from "./AffiliateInner/AffiliatePersonalInfo";
import AffiliateSettingsForm from "./AffiliateInner/AffiliateSettingsForm";
import WithdrawBalance from "./AffiliateInner/WithdrawBalance";

const AffiliateProfile = () => {
  const { affiliateInfo, user } = useAuth();

  if (!affiliateInfo) return <div>Loading...</div>;

  const isShow = user?.role === "admin" || user?.id === affiliateInfo?.id;
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
