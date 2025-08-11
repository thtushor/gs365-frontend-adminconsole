// pages/AffiliateProfile.js
import { useAuth } from "../hooks/useAuth";
import AffiliatePersonalInfo from "./AffiliateInner/AffiliatePersonalInfo";
import AffiliateSettingsForm from "./AffiliateInner/AffiliateSettingsForm";
import WithdrawBalance from "./AffiliateInner/WithdrawBalance";

const AffiliateProfile = () => {
  const { affiliateInfo } = useAuth();

  if (!affiliateInfo) return <div>Loading...</div>;

  return (
    <div className="p-0 space-y-6">
      <AffiliatePersonalInfo info={affiliateInfo} />

      {/* TODO: Shufol bhaiya */}
      <WithdrawBalance info={affiliateInfo} />
      <AffiliateSettingsForm info={affiliateInfo} />
    </div>
  );
};

export default AffiliateProfile;
