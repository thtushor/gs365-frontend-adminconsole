import React, { useState, useEffect } from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import ChatCard from "../ChatCard/ChatCard";
import { useChats } from "../../hooks/useChats"; // Import the custom hook
import { useChat } from "../../hooks/useChat";
import Loader from "../Loader"; // Import the Loader component
import moment from "moment";

const SupportLeft = ({ chatUserType, showLeftPanelMobile, setShowLeftPanelMobile }) => { // Accept chatUserType as a prop
  const [searchKey, setSearchKey] = useState("");

  const { setSelectedChat, selectedChat } = useChat();

  const { data: chatData, isLoading, isError } = useChats(chatUserType, searchKey);

  console.log({chatData})

  // Reset active chat when chatUserType changes
  useEffect(() => {
    setSelectedChat(null); // Clear selected chat when user type changes
  }, [chatUserType, setSelectedChat]);

  // Effect to handle selectedChat when chatData changes (e.g., after a search)
  useEffect(() => {
    if (chatData && selectedChat) {
      const updatedSelectedChat = chatData.find(chat => chat.id === selectedChat.id);
      if (updatedSelectedChat) {
        setSelectedChat(updatedSelectedChat); // Update selectedChat with the latest data
      } else {
        setSelectedChat(chatData.length > 0 ? chatData[0] : null); // Select first chat or null if not found
      }
    } else if (chatData && chatData.length > 0 && !selectedChat) {
      setSelectedChat(chatData[0]); // Automatically select the first chat if none is selected
    } else if (!chatData || chatData.length === 0) {
      setSelectedChat(null); // Clear selected chat if no chats are available
    }
  }, [chatData, selectedChat, setSelectedChat]);


  // Helper function to format time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "N/A"; // Handle null or undefined timestamp
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  // if (isLoading) {
  //   return <div className="p-4 text-white">Loading chats...</div>;
  // }

  // if (isError) {
  //   return <div className="p-4 text-red-500">Error loading chats.</div>;
  // }

  console.log({setSelectedChat,selectedChat})

  return (
    <div className={`bg-[#07122b] overflow-y-auto w-full md:min-w-[300px] md:w-auto border-r-[3px] border-[#01dc84] ${showLeftPanelMobile ? "block" : "hidden md:block"}`}>
      <div className="p-[10px] py-2 border-b bg-[#07122b] z-[5] border-[#01dc844e] sticky top-0">
        {/* search bar  */}
        <div className="border border-[#01dc84] rounded-md bg-[#01dc8423]">
          <input
            type="text"
            className="w-full outline-none text-[14px] md:text-[16px] p-3 py-[7px] bg-transparent text-white"
            placeholder="Search conversation..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
      </div>

      {/* all conversation highlight here */}
      <div>
        {isLoading ? (
          <div className="flex w-full justify-center h-32">
            <Loader />
          </div>
        ) : isError ? (
          <div className="p-4 text-red-500 text-center">Error loading chats.</div>
        ) : chatData && chatData.length > 0 ? (
          chatData.map((chat) => {
            const displayName = chatUserType === "admin"
              ? (chat?.fullname || "Unknown Admin")
              : chatUserType==="user" ?  (chat?.username || "Unknown User"): (chat.guestId||"Guest Unknown");

            const lastChat = chat.type==="guest" ? chat : chat?.chats && chat.chats.length > 0
              ? chat.chats[chat.chats.length - 1]
              : null;

            const lastMessageObj = lastChat?.messages && lastChat.messages.length > 0
              ? lastChat.messages[lastChat.messages.length - 1]
              : null;

              // console.log({lastChat,lastMessageObj})

            const lastMessageContent = lastMessageObj?.content;
            const hasAttachment = !!lastMessageObj?.attachmentUrl;
            const chatCreatedAt = lastMessageObj?.createdAt || chat?.created_at;
            const isLoggedIn = chatUserType === "admin" ? (chat?.isLoggedIn ?? false) : (chat?.isLoggedIn ?? false);
            // The user confirmed that the 'Z' suffix is incorrect and 15:50:53 should be treated as BDT time.
            // We remove the 'Z' to ensure moment parses it as local time directly.
            const timeToDisplay = chatCreatedAt ? moment(chatCreatedAt.replace('Z', '')).calendar() : "N/A";

            return (
              <ChatCard
                key={chat?.id || `chat-${Math.random()}`} // Fallback key
                name={displayName}
                message={lastMessageContent}
                time={timeToDisplay}
                avatar={ChatAvatar}
                isActive={chat?.id === selectedChat?.id}
                isUserActive={isLoggedIn}
                hasAttachment={hasAttachment}
                onClick={() => {
                  setSelectedChat(chat);
                  setShowLeftPanelMobile(false); // Hide left panel when a chat is selected on mobile
                }}
              />
            );
          })
        ) : (
          <div className="p-4 text-white text-center">Start a conversation...</div>
        )}
      </div>
    </div>
  );
};

export default SupportLeft;
