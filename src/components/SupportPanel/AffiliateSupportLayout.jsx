import React from "react";
import SupportLeft from "./SupportLeft";
import SupportRight from "./SupportRight";
import { useAuth } from "../../hooks/useAuth";
import { ChatProvider } from "../../hooks/useChat";

const AffiliateSupportLayout = () => {
  const { user } = useAuth();
  const isAffiliate =
    user?.role === "affiliate" || user?.role === "superAffiliate";
  return (
    <ChatProvider>
    <div className="h-[60vh]">
      <div className="bg-green-50 h-full text-white flex border-[3px] border-[#01dc84] rounded-xl overflow-hidden">
        <SupportLeft chatUserType={"admin"} />
        <SupportRight isAffiliate={isAffiliate} />
      </div>
    </div>
    </ChatProvider>
  );
};

export default AffiliateSupportLayout;
