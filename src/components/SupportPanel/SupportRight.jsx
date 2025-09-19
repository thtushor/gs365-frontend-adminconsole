import React, { useState, useEffect, useRef } from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import { LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";
import { useChat } from "../../hooks/useChat";

import moment from "moment";
import { useAuth } from "../../hooks/useAuth";

const SupportRight = () => {
  const { user } = useAuth();
  const { selectedChat, messages, loading, sendMessage, createChat } = useChat();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;

    if (!selectedChat) {
      // If no chat is selected, create a new one
      const newChat = await createChat(messageInput);
      if (newChat) {
        await sendMessage(newChat.id, messageInput);
      }
    } else {
      await sendMessage(selectedChat.id, messageInput);
    }
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const getSenderName = (message) => {
    if (message.senderType === "user" && message.senderUser) {
      return message.senderUser.fullname || message.senderUser.username;
    }
    if (message.senderType === "admin" && message.senderAdmin) {
      return message.senderAdmin.fullname || message.senderAdmin.username;
    }
    return "Unknown";
  };

  if (!selectedChat) {
    return (
      <div className="text-[#07122b] w-full relative flex items-center justify-center h-full">
        <p className="text-white/70">Select a chat to start messaging</p>
      </div>
    );
  }

  console.log({selectedChat})

  return (
    <div className="text-[#07122b] w-full relative flex flex-col h-full">
      {/* top */}
      <div className="p-4 py-[9.5px] flex items-center gap-2 border-b-2 border-[#01dc84] text-white bg-[#07122b] flex-shrink-0">
        <img
          src={ChatAvatar}
          alt=""
          className="w-[35px] h-[35px] border rounded-md bg-white border-white"
        />
        <div>
          <h1 className="flex items-center mt-[-2px] text-[#01dc84] gap-1 font-semibold">
            {selectedChat.participantDetails?.fullname || selectedChat.participantDetails?.username || "N/A"}{" "}
            <span className="text-[12px] bg-[#01dc84] px-[6px] text-white leading-4 block rounded-full">
              {selectedChat.type === "user" ? "Player" : "Admin"}
            </span>
          </h1>
          <p className="text-[12px] mt-[-3px] text-white/80">
            {selectedChat.participantDetails?.email || "N/A"}
          </p>
        </div>
      </div>

      {/* center */}
      <div className="p-4 py-2 flex-1 overflow-y-auto space-y-1">
        {loading && <p className="text-white text-center">Loading messages...</p>}
        {messages.map((message) => {
          const isCurrentUser = user.id === message.senderId;
          const senderName = getSenderName(message);
          return (
            <div
              key={message.id}
              className={`flex flex-col ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`${
                  isCurrentUser
                    ? "bg-[#01dc84] text-white"
                    : "bg-gray-200 text-black"
                } px-4 py-2 rounded-lg max-w-xs md:max-w-sm relative group`}
              >
                {message.content}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {senderName}
                </span>
              </div>
              <span
                className={`text-xs mt-1 ${
                  isCurrentUser ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {moment(message.createdAt).format("hh:mm A")}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* bottom */}
      <div className="p-2 py-2 flex items-center gap-2 w-full bg-[#07122b] border-t-2 border-[#01dc84] flex-shrink-0">
        <div className="header-auth">
          <div className="signup-btn-green !cursor-pointer !text-[27px] !min-w-[40px] !max-w-[40px] !p-0 flex items-center justify-center !border-[2px] !max-h-[40px] !min-h-[40px]">
            <TiAttachment />
          </div>
        </div>
        <div className="flex w-full">
          <input
            placeholder="What's on your mind?"
            className="border border-[#01dc84] text-white placeholder:text-white/70 placeholder:font-normal w-full rounded-l-md px-3 outline-none font-medium"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="header-auth">
            <div
              className="signup-btn-green  !cursor-pointer !min-w-[40px] !rounded-l-none !rounded-md !max-w-[40px] !p-0 flex items-center justify-center !border-[2px] !max-h-[40px] !min-h-[40px]"
              onClick={handleSendMessage}
            >
              <LuSend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportRight;
