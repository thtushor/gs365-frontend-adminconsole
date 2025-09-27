import React, { useState, useEffect, useRef } from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import { LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";
import { FaRegFile, FaDownload } from "react-icons/fa"; // Import document and download icon
import { IoCloseCircle } from "react-icons/io5"; // Import close icon
import { MdZoomIn } from "react-icons/md"; // Import zoom in icon
// import { useChat } from "../../hooks/useChat";

import moment from "moment";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SupportRight = ({ isAffiliate, showLeftPanelMobile, setShowLeftPanelMobile }) => {
  const { user } = useAuth();
  const { selectedChat, setSelectedChat, activeConversation, messages, loading, sendMessage, createChat, uploadAttachment } = useChat();
  const navigate = useNavigate(); // Initialize useNavigate

  const [messageInput, setMessageInput] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null); // Stores the actual file object
  const [attachmentPreview, setAttachmentPreview] = useState(null); // Stores URL for image preview or file details
  const [sendingMessage, setSendingMessage] = useState(false); // New state for send button loading
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.attachmentUrl && lastMessage.attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
        const img = new Image();
        img.src = lastMessage.attachmentUrl;
        img.onload = () => {
          scrollToBottom();
        };
      }
    }
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
    setSendingMessage(true); // Start loading

    let attachmentUrl = null;
    try {
      if (attachmentFile) {
        attachmentUrl = await uploadAttachment(attachmentFile);
        setAttachmentFile(null); // Clear the selected file after upload
        setAttachmentPreview(null); // Clear the preview after upload
      }

      const senderType = ["superAdmin", "admin", "superAgent", "agent", "superAffiliate", "affiliate"].includes(user.role) ? "admin" : "user";

      const hasMessage = Boolean(messages?.length)

      const chatid = hasMessage ? messages[messages.length - 1].chatId : undefined

      console.log({ chatid })

      if (!chatid) {
        const isSelectedAdminChat = Boolean(selectedChat?.role)
        await createChat({
          initialMessageContent: messageInput,
          targetUserId: !isSelectedAdminChat ? selectedChat?.id : undefined,
          targetAffiliateId: isSelectedAdminChat ? selectedChat?.id : undefined,
          targetAdminId: user?.id,
          attachmentUrl,
          senderType,
        });
      } else {
        await sendMessage({ chatId: chatid, content: messageInput, attachmentUrl });
      }
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message or upload attachment:", error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setSendingMessage(false); // End loading
    }
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
    return message?.guestSenderId || "Unknown";
  };

  if (!selectedChat && !isAffiliate) {
    return (
      <div className="text-[#07122b] w-full relative flex items-center justify-center h-full">
        <p className="text-white/70">Select a chat to start messaging</p>
      </div>
    );
  }

  // console.log({activeConversation,selectedChat,messages})

  return (
    <>
      <div className={`text-[#07122b] w-full relative flex flex-col h-full ${showLeftPanelMobile ? "hidden md:flex" : "block"}`}>
        {/* top */}
        <div className="p-4 py-[9.5px] flex items-center gap-2 border-b-2 border-[#01dc84] text-white bg-[#07122b] flex-shrink-0">
          {!showLeftPanelMobile && (
            <button
              className="md:hidden text-white text-2xl mr-2"
              onClick={() => {
                setSelectedChat(null);
                setShowLeftPanelMobile(true); // Show left panel when going back
              }}
            >
              &larr;
            </button>
          )}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (selectedChat) {
                if (selectedChat.role) {
                  // It's an affiliate
                  navigate(`/affiliate-list/${selectedChat.id}`);
                } else {
                  // It's a player
                  navigate(`/players/${selectedChat.id}/profile`);
                }
              }
            }}
          >
            <img
              src={ChatAvatar}
              alt=""
              className="w-[35px] h-[35px] border rounded-md bg-white border-white"
            />
            <div>
              <h1 className="flex items-center mt-[-2px] text-[#01dc84] gap-1 font-semibold">
                {selectedChat?.type === "guest" ? selectedChat.guestId : selectedChat?.fullname || selectedChat?.username || "Support"}{" "}
                <span className="text-[12px] bg-[#01dc84] px-[6px] text-white leading-4 capitalize block rounded-full">
                  {selectedChat?.role ? selectedChat?.role : "Player"}
                </span>
              </h1>
              <p className="text-[12px] mt-[-3px] text-white/80">
                {selectedChat?.email && selectedChat?.email}
              </p>
            </div>
          </div>
        </div>

        {/* center */}
        <div className="p-4 py-2 flex-1 overflow-y-auto space-y-1">
          {loading && <p className="text-green-500 text-center">Loading messages...</p>}

          {messages.map((message) => {
            const isCurrentUser = user.id === message?.senderAdmin?.id && user?.role === message?.senderAdmin?.role && message?.senderType === "admin";
            const senderName = getSenderName(message);
            return (
              <div
                key={message?.id}
                className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`${isCurrentUser
                      ? "bg-[#01dc84] text-white"
                      : "bg-gray-200 text-black"
                    } px-4 py-2 rounded-lg max-w-[80%] md:max-w-sm relative group`}
                >
                  {message?.content && <p>{message?.content}</p>}
                  {message?.attachmentUrl && (
                    <div className="mt-2">
                      {message.attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                        <div className="relative">
                          <img
                            src={message.attachmentUrl}
                            alt="Attachment"
                            className="max-w-full max-h-40 object-contain rounded-md cursor-pointer"
                            onClick={() => {
                              setSelectedImage(message.attachmentUrl);
                              setShowImageModal(true);
                            }}
                          />
                          <div className="absolute top-1 right-1 flex gap-1 bg-black bg-opacity-50 p-1 rounded-md">
                            <MdZoomIn
                              className="text-white cursor-pointer"
                              onClick={() => {
                                setSelectedImage(message.attachmentUrl);
                                setShowImageModal(true);
                              }}
                              title="Preview Image"
                            />
                            <a
                              href={message.attachmentUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white cursor-pointer"
                              title="Download Image"
                            >
                              <FaDownload />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-md">
                          <FaRegFile className="text-white text-xl" />
                          <span className="text-white text-sm">
                            {message.attachmentUrl.substring(message.attachmentUrl.lastIndexOf('/') + 1)}
                          </span>
                          <a
                            href={message.attachmentUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white cursor-pointer ml-auto"
                            title="Download File"
                          >
                            <FaDownload />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {senderName}
                  </span>
                </div>
                <span
                  className={`text-xs mt-1 ${isCurrentUser ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {moment(message?.createdAt?.replace("Z", "")).calendar()}
                  {/* moment(chatCreatedAt.replace('Z', '')).fromNow() */}
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
            accept="image/*" // Accept only image files
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
              disabled={sendingMessage} // Disable input while sending
            />
            <div className="header-auth">
              <button
                className="signup-btn-green !cursor-pointer !min-w-[40px] !rounded-l-none !rounded-md !max-w-[40px] !p-0 flex items-center justify-center !border-[2px] !max-h-[40px] !min-h-[40px]"
                onClick={handleSendMessage}
                disabled={sendingMessage} // Disable button while sending
              >
                {sendingMessage ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> // Spinner
                ) : (
                  <LuSend />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 text-3xl"
              onClick={() => setShowImageModal(false)}
            >
              <IoCloseCircle />
            </button>
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
            <a
              href={selectedImage}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-[#01dc84] text-white px-4 py-2 rounded-md flex items-center gap-2"
              title="Download Image"
            >
              <FaDownload /> Download
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportRight;
