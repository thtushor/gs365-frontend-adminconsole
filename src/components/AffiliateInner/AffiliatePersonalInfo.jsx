import React from "react";

const InfoBox = ({ label, value, color = "border-gray-300 text-gray-700" }) => (
  <div
    className={`p-2 bg-white px-3 border rounded-lg overflow-hidden shadow-md border-gray-300 text-black`}
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
          color="border-green-400 text-green-700"
        />
        <InfoBox
          label="Username"
          value={info.username || "N/A"}
          color="border-blue-400 text-blue-700"
        />
        <InfoBox
          label="Email"
          value={info.email || "N/A"}
          color="border-purple-400 text-purple-700"
        />
        <InfoBox
          label="Phone"
          value={info.phone || "N/A"}
          color="border-yellow-400 text-yellow-700"
        />
        <InfoBox
          label="Upline Affiliate"
          value={info.referred_by ? info.referDetails?.fullname : "N/A"}
          color="border-orange-400 text-orange-700"
        />
        <InfoBox
          label="Register Date & Time"
          value={getFormattedDate(info.created_at)}
        />
        <InfoBox label="Register IP" value={info.ip_address || "N/A"} />
        <InfoBox label="Device Type" value={info.device_type || "N/A"} />
        <InfoBox
          label="Last Login Date & Time"
          value={getFormattedDate(info.lastLogin)}
        />
        <InfoBox label="Last Login IP" value={info.lastIp || "N/A"} />
        <InfoBox
          label="Commission Percent"
          value={`${info.commission_percent || 0}%`}
          color="border-pink-400 text-pink-700"
        />
        <InfoBox
          label="Role"
          value={
            info.role === "affiliate" ? "Sub Affiliate" : "Super Affiliate"
          }
          color="border-indigo-400 text-indigo-700"
        />
        <InfoBox
          label="Country"
          value={info.countryDetails ? `${info.countryDetails?.name}` : "N/A"}
        />
        <InfoBox
          label="Currency"
          value={
            info.currencyInfo
              ? `${info.currencyInfo?.name} (${info.currencyInfo.code})`
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

export default AffiliatePersonalInfo;
