import React, { useState, useEffect } from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import ChatCard from "../ChatCard/ChatCard";
import { useChats } from "../../hooks/useChats"; // Import the custom hook
import { useChat } from "../../hooks/useChat";

const SupportLeft = ({ chatUserType }) => { // Accept chatUserType as a prop
  const [activeChat, setActiveChat] = useState(0);
  const [searchKey, setSearchKey] = useState("");

  const {setSelectedChat,selectedChat}= useChat()

  const { data: chatData, isLoading, isError } = useChats(chatUserType, searchKey);

  // Reset active chat when chatUserType changes
  useEffect(() => {
    setActiveChat(0);
  }, [chatUserType]);

  // Helper function to format time
  const formatTimeAgo = (timestamp) => {
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

  if (isLoading) {
    return <div className="p-4 text-white">Loading chats...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error loading chats.</div>;
  }

  console.log({setSelectedChat,selectedChat})

  return (
    <div className="bg-[#07122b] overflow-y-auto min-w-[300px] border-r-[3px] border-[#01dc84]">
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
        {chatData && chatData.length > 0 ? (
          chatData.map((chat, index) => {
            const displayName = chatUserType === "admin" ? chat.fullname : chat.username;
            const lastChat = chat.chats && chat.chats.length > 0 ? chat.chats[chat.chats.length - 1] : null;
            const lastMessage = lastChat && lastChat.messages.length > 0 
              ? lastChat.messages[lastChat.messages.length - 1].content
              : "No messages";
            const chatCreatedAt = lastChat ? lastChat.createdAt : chat.created_at;
            const isLoggedIn = chatUserType === "admin" ? chat.isLoggedIn : chat.isLoggedIn; // Assuming isLoggedIn is consistent
            const timeToDisplay = lastChat ? formatTimeAgo(chatCreatedAt) : null; // Pass null if no chat exists

            return (
              <ChatCard
                key={chat.id}
                name={displayName}
                message={lastMessage}
                time={timeToDisplay}
                avatar={ChatAvatar}
                isActive={activeChat === index}
                isUserActive={isLoggedIn}
                onClick={() => setSelectedChat(chat)}
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
