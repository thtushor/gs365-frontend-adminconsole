import React, { useState } from "react";
import SupportLeft from "./SupportLeft";
import SupportRight from "./SupportRight";
import { Link } from "react-router-dom";
import { ChatProvider } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Axios from "../../api/axios";
import { IoMailUnread } from "react-icons/io5";

const SupportLayout = () => {
  const [chatUserType, setChatUserType] = useState("user"); // Default to user chats based on "Player Conversation"
  const [showLeftPanelMobile, setShowLeftPanelMobile] = useState(true); // State to control visibility of SupportLeft on mobile

  const { user } = useAuth();
  const userType =
    user?.role === "affiliate" || user?.role === "superAffiliate"
      ? "affiliate"
      : "admin";
  const { data: chatsCount } = useQuery({
    queryKey: ["chats-count", userType],
    queryFn: async () => {
      const response = await Axios.get("/api/chats/count-unread", {
        params: {
          affiliateId:
            userType === "admin"
              ? undefined
              : userType === "affiliate"
              ? user.id
              : false,
        },
      });
      return response?.data?.data;
    },
  });

  return (
    <ChatProvider>
      <div className="h-[88vh] pb-10 flex flex-col">
        <div className="bg-[#07122b] mb-2 rounded-full py-1 px-1 w-fit flex gap-1 mx-auto md:mx-0">
          <Link
            className={`${
              chatUserType === "guest"
                ? "bg-[#01dc84] text-black"
                : "text-white bg-[#01dc842e]"
            } relative px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => {
              setChatUserType("guest");
              setShowLeftPanelMobile(true); // Always show left panel when changing chat type
            }}
          >
            Guest{" "}
            {chatsCount?.countGuest > 0 && (
              <span className="absolute text-white gap-0.5 rounded-full min-w-4 px-1 text-[11px] flex items-center justify-center h-4 left-1/2 -translate-x-1/2 -top-[10px] bg-red-500">
                <IoMailUnread size={12} />{" "}
                {chatsCount?.countGuest > 99 ? "99+" : chatsCount?.countGuest}
              </span>
            )}
          </Link>
          <Link
            className={`${
              chatUserType === "user"
                ? "bg-[#01dc84] text-black"
                : "text-white bg-[#01dc842e]"
            } relative px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => {
              setChatUserType("user");
              setShowLeftPanelMobile(true); // Always show left panel when changing chat type
            }}
          >
            Player
            {chatsCount?.countUser > 0 && (
              <span className="absolute text-white gap-0.5 rounded-full min-w-4 px-1 text-[11px] flex items-center justify-center h-4 left-1/2 -translate-x-1/2 -top-[10px] bg-red-500">
                <IoMailUnread size={12} />{" "}
                {chatsCount?.countUser > 99 ? "99+" : chatsCount?.countUser}
              </span>
            )}
          </Link>
          <Link
            className={`${
              chatUserType === "admin"
                ? "bg-[#01dc84] text-black"
                : "text-white bg-[#01dc842e]"
            } relative px-4 font-semibold py-1 text-[14px] rounded-full`}
            onClick={() => {
              setChatUserType("admin");
              setShowLeftPanelMobile(true); // Always show left panel when changing chat type
            }}
          >
            Affiliate
            {chatsCount?.countAffiliate > 0 && (
              <span className="absolute text-white gap-0.5 rounded-full min-w-4 px-1 text-[11px] flex items-center justify-center h-4 left-1/2 -translate-x-1/2 -top-[10px] bg-red-500">
                <IoMailUnread size={12} />{" "}
                {chatsCount?.countAffiliate > 99
                  ? "99+"
                  : chatsCount?.countAffiliate}
              </span>
            )}
          </Link>
        </div>
        <div className="bg-green-50 h-full text-white flex flex-col md:flex-row border border-[#07122b] rounded-xl overflow-hidden">
          <SupportLeft
            chatUserType={chatUserType}
            showLeftPanelMobile={showLeftPanelMobile}
            setShowLeftPanelMobile={setShowLeftPanelMobile}
          />
          <SupportRight
            isAffiliate={true}
            showLeftPanelMobile={showLeftPanelMobile}
            setShowLeftPanelMobile={setShowLeftPanelMobile}
          />
        </div>
      </div>
    </ChatProvider>
  );
};

export default SupportLayout;
