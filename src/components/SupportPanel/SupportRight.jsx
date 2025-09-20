import React, { useState, useEffect, useRef } from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import { LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";
import { FaRegFile } from "react-icons/fa"; // Import document icon
import { IoCloseCircle } from "react-icons/io5"; // Import close icon
// import { useChat } from "../../hooks/useChat";

import moment from "moment";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

const SupportRight = () => {
  const { user } = useAuth();
  const { selectedChat, activeConversation, messages, loading, sendMessage, createChat, uploadAttachment } = useChat();
  const [messageInput, setMessageInput] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null); // Stores the actual file object
  const [attachmentPreview, setAttachmentPreview] = useState(null); // Stores URL for image preview or file details
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview({ name: file.name, type: file.type });
      }
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "" && !attachmentFile) return;

    let attachmentUrl = null;
    if (attachmentFile) {
      try {
        attachmentUrl = await uploadAttachment(attachmentFile);
        setAttachmentFile(null); // Clear the selected file after upload
        setAttachmentPreview(null); // Clear the preview after upload
      } catch (error) {
        console.error("Failed to upload attachment:", error);
        // Handle error (e.g., show a toast notification)
        return; // Stop sending message if attachment upload fails
      }
    }

    if (!activeConversation) {
      const newChat = await createChat({
        initialMessageContent: messageInput,
        targetUserId: selectedChat.id,
      });
      // if (newChat) {
      //   await sendMessage({ chatId: newChat.id, content: messageInput, attachmentUrl });
      // }
    } else {
      await sendMessage({ chatId: activeConversation.id, content: messageInput, attachmentUrl });
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

  console.log({activeConversation,selectedChat})

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
            {selectedChat.fullname || selectedChat.username || "N/A"}{" "}
            <span className="text-[12px] bg-[#01dc84] px-[6px] text-white leading-4 block rounded-full">
              {activeConversation?.type === "user" ? "Player" : "Admin"}
            </span>
          </h1>
          <p className="text-[12px] mt-[-3px] text-white/80">
            {selectedChat.email || "N/A"}
          </p>
        </div>
      </div>

      {/* center */}
      <div className="p-4 py-2 flex-1 overflow-y-auto space-y-1">
        {loading && <p className="text-white text-center">Loading messages...</p>}
        {!activeConversation && !loading && (
          <div className="text-white/70 text-center h-full flex items-center justify-center">
            <p>Start a conversation with {selectedChat.fullname || selectedChat.username}!</p>
          </div>
        )}
        {activeConversation && messages.map((message) => {
          const isCurrentUser = user.id === message.senderAdmin?.id && user.role === message.senderAdmin?.role && message?.senderType==="admin";
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
                {message.content && <p>{message.content}</p>}
                {message.attachmentUrl && (
                  <img src={message.attachmentUrl} alt="Attachment" className="max-w-full h-auto rounded-md mt-2" />
                )}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {senderName}
                </span>
              </div>
              <span
                className={`text-xs mt-1 ${
                  isCurrentUser ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {moment(new Date(message.createdAt)).format("hh:mm A")}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* bottom */}
      <div className="p-2 py-2 flex items-center gap-2 w-full bg-[#07122b] border-t-2 border-[#01dc84] flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="header-auth">
          <div
            className="signup-btn-green !cursor-pointer !text-[27px] !min-w-[40px] !max-w-[40px] !p-0 flex items-center justify-center !border-[2px] !max-h-[40px] !min-h-[40px]"
            onClick={handleAttachmentClick}
          >
            <TiAttachment />
          </div>
        </div>
        {attachmentPreview && (
          <div className="relative flex items-center gap-3 p-3 bg-gray-800 rounded-lg shadow-md mb-2" title={attachmentFile.name}>
            {typeof attachmentPreview === "string" && attachmentFile.type.startsWith("image/") ? (
              <img src={attachmentPreview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
            ) : (
              <FaRegFile className="text-white text-4xl" />
            )}
            
            <button
              onClick={() => {
                setAttachmentFile(null);
                setAttachmentPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
              }}
              className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-xl"
            >
              <IoCloseCircle />
            </button>
          </div>
        )}
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
