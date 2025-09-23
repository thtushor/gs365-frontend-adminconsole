import React, { useState } from "react";
import SupportLeft from "./SupportLeft";
import SupportRight from "./SupportRight";
import { Link } from "react-router-dom";
import { ChatProvider } from "../../hooks/useChat";

const SupportLayout = () => {
  const [chatUserType, setChatUserType] = useState("user"); // Default to user chats based on "Player Conversation"
  const [showLeftPanelMobile, setShowLeftPanelMobile] = useState(true); // State to control visibility of SupportLeft on mobile

  return (
    <ChatProvider>
      <div className="h-[88vh] pb-10 flex flex-col">
        <div className="bg-[#07122b] mb-2 rounded-full py-1 px-1 w-fit flex gap-1 mx-auto md:mx-0">
          <Link
            className={`${
              chatUserType === "guest" ? "bg-[#01dc84] text-black" : "text-white"
            } px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => {
              setChatUserType("guest");
              setShowLeftPanelMobile(true); // Always show left panel when changing chat type
            }}
          >
            Guest
          </Link>
          <Link
            className={`${
              chatUserType === "user" ? "bg-[#01dc84] text-black" : "text-white"
            } px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => {
              setChatUserType("user");
              setShowLeftPanelMobile(true); // Always show left panel when changing chat type
            }}
          >
            Player
          </Link>
          <Link
            className={`${
              chatUserType === "admin" ? "bg-[#01dc84] text-black" : "text-white"
            } px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => {
              setChatUserType("admin");
              setShowLeftPanelMobile(true); // Always show left panel when changing chat type
            }}
          >
            Affiliate
          </Link>
        </div>
        <div className="bg-green-50 h-full text-white flex flex-col md:flex-row border border-[#07122b] rounded-xl overflow-hidden">
          <SupportLeft chatUserType={chatUserType} showLeftPanelMobile={showLeftPanelMobile} setShowLeftPanelMobile={setShowLeftPanelMobile} />
          <SupportRight isAffiliate={true} showLeftPanelMobile={showLeftPanelMobile} setShowLeftPanelMobile={setShowLeftPanelMobile} />
        </div>
      </div>
    </ChatProvider>
  );
};

export default SupportLayout;
