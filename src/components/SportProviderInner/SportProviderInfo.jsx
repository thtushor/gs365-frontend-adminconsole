import React from "react";
import { Link } from "react-router-dom";
import { useCurrencies } from "../shared/useCurrencies";

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

const SportProviderInfo = ({ info }) => {
  console.log(info);
  const getFormattedDate = (date) =>
    date ? new Date(date).toLocaleString() : "N/A";
  const { data: countries, isLoading } = useCurrencies();
  console.log(countries);
  const providerCountry =
    countries?.length > 0
      ? countries?.find((c) => c?.id === Number(info?.country))
      : "N/A";

  console.log(providerCountry);
  return (
    <div className="border-2 border-[#07122b] bg-[#f5f5f5] p-4 rounded-md">
      <div className="flex items-center justify-between mb-2 flex-wrap">
        <h1 className="mt-[-5px] text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 pt-[2px] mb-2">
          Sport Provider Information
        </h1>
        <Link
          to={
            info?.parentId
              ? `/add-sport-provider?providerId=${info.id}`
              : `/add-parent-sport-provider?providerId=${info.id}`
          }
          className="bg-green-200 border border-green-500 px-2 rounded-md hover:font-medium cursor-pointer text-green-500 w-fit"
        >
          Edit
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox
          label="Provider Name"
          value={info.name || "N/A"}
          color="border-green-400 text-green-700"
        />

        {info?.parentName && info?.parentId && (
          <InfoBox
            label="Parent Provider Name"
            value={info.parentName || "N/A"}
            color="border-blue-400 text-blue-700"
          />
        )}
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
          label="Provider IP"
          value={info.providerIp || "N/A"}
          color="border-orange-400 text-orange-700"
        />
        <InfoBox
          label="License Key"
          value={info.licenseKey || "N/A"}
          color="border-orange-400 text-orange-700"
        />
        <InfoBox
          label="Register Date & Time"
          value={getFormattedDate(info.createdAt)}
        />
        <InfoBox label="WhatsApp" value={info.whatsapp || "N/A"} />
        <InfoBox label="Telegram" value={info.telegram || "N/A"} />
        <InfoBox
          label="Role"
          value={info.parentId ? "Provider" : "Parent Provider"}
          color="border-indigo-400 text-indigo-700"
        />
        <InfoBox
          label="Country Currency"
          value={
            providerCountry?.id
              ? `${providerCountry?.name} (${providerCountry?.code})`
              : "N/A"
          }
        />
      </div>
    </div>
  );
};

export default SportProviderInfo;
