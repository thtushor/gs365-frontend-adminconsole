import React from "react";

const InfoBox = ({ label, value, color }) => (
  <div
    className={`p-2 bg-white px-3 border rounded-lg overflow-hidden shadow-md ${color}`}
  >
    <div className="text-xs font-medium text-gray-500">{label}</div>
    <div className="text-base font-semibold truncate" title={value}>
      {value}
    </div>
  </div>
);

const AffiliatePersonalInfo = ({ info }) => {
  const getFormattedDate = (date) =>
    date ? new Date(date).toLocaleString() : "N/A";

  return (
    <div className="border-2 border-[#07122b] bg-[#f5f5f5] p-4 rounded-md">
      <h1 className="mt-[-5px] text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 pt-[2px] mb-2">
        Personal Information
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox
          label="Full Name"
          value={info.fullname || "N/A"}
          color="border-green-500 text-green-500"
        />
        <InfoBox
          label="Username"
          value={info.username || "N/A"}
          color="border-blue-500 text-blue-500"
        />
        <InfoBox
          label="Email"
          value={info.email || "N/A"}
          color="border-yellow-500 text-yellow-500"
        />
        <InfoBox
          label="Phone"
          value={info.phone || "N/A"}
          color="border-purple-500 text-purple-500"
        />
        <InfoBox
          label="Upline Affiliate"
          value={info.referred_by ? info.referDetails?.fullname : "N/A"}
          color="border-pink-500 text-pink-500"
        />
        <InfoBox
          label="Register Date & Time"
          value={getFormattedDate(info.created_at)}
          color="border-indigo-500 text-indigo-500"
        />
        <InfoBox
          label="Register IP"
          value={info.ip_address || "N/A"}
          color="border-orange-500 text-orange-500"
        />
        <InfoBox
          label="Device Type"
          value={info.device_type || "N/A"}
          color="border-teal-500 text-teal-500"
        />
        <InfoBox
          label="Last Login Date & Time"
          value={getFormattedDate(info.lastLogin)}
          color="border-cyan-500 text-cyan-500"
        />
        <InfoBox
          label="Last Login IP"
          value={info.lastIp || "N/A"}
          color="border-lime-500 text-lime-500"
        />
        <InfoBox
          label="Commission Percent"
          value={`${info.commission_percent || 0}%`}
          color="border-fuchsia-500 text-fuchsia-500"
        />
        <InfoBox
          label="Role"
          value={
            info.role === "affiliate" ? "Sub Affiliate" : "Super Affiliate"
          }
          color="border-rose-500 text-rose-500"
        />
        <InfoBox
          label="Country"
          value={info.countryDetails ? info.countryDetails?.name : "N/A"}
          color="border-amber-500 text-amber-500"
        />
        <InfoBox
          label="Currency"
          value={
            info.currencyInfo
              ? `${info.currencyInfo?.name} (${info.currencyInfo.code})`
              : "N/A"
          }
          color="border-violet-500 text-violet-500"
        />
        <InfoBox
          label="KYC Status"
          value={
            info.kyc_status === "verified"
              ? "Verified"
              : info.kyc_status === "required"
              ? "Required"
              : "Unverified"
          }
          color={
            info.kyc_status === "verified"
              ? "border-green-500 text-green-500"
              : info.kyc_status === "required"
              ? "border-red-500 text-red-500"
              : "border-orange-500 text-orange-500"
          }
        />
      </div>
    </div>
  );
};

export default AffiliatePersonalInfo;
