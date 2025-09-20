import React, { useState } from "react";
import SupportLeft from "./SupportLeft";
import SupportRight from "./SupportRight";
import { Link } from "react-router-dom";
import { ChatProvider } from "../../hooks/useChat";

const SupportLayout = () => {
  const [chatUserType, setChatUserType] = useState("user"); // Default to user chats based on "Player Conversation"

  return (
    <ChatProvider>
      <div className="h-[82vh] pb-10">
        <div className="bg-[#07122b] mb-2 rounded-full py-1 px-1 w-fit flex gap-1">
          <Link
            className={`${
              chatUserType === "user" ? "bg-[#01dc84] text-black" : "text-white"
            } px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => setChatUserType("user")}
          >
            Player
          </Link>
          <Link
            className={`${
              chatUserType === "admin" ? "bg-[#01dc84] text-black" : "text-white"
            } px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => setChatUserType("admin")}
          >
            Affiliate
          </Link>
        </div>
        <div className="bg-green-50 h-full text-white flex border border-[#07122b] rounded-xl overflow-hidden">
          <SupportLeft chatUserType={chatUserType} />
          <SupportRight isAffiliate={true} />
        </div>
      </div>
    </ChatProvider>
  );
};

export default SupportLayout;
