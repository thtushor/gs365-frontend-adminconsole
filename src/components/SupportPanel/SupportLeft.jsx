import React, { useState } from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import ChatCard from "../ChatCard/ChatCard"; // Import the new ChatCard component

const SupportLeft = () => {
  const [activeChat, setActiveChat] = useState(0); // State to manage active chat

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

  // Sample data for chat cards based on the provided structure
  const chatData = [
    {
      id: 1,
      userId: 1,
      adminUserId: null,
      status: "open",
      type: "user",
      createdAt: "2025-09-19T00:49:43.000Z",
      updatedAt: "2025-09-19T00:49:43.000Z",
      user: {
        id: 1,
        username: "alice123",
        fullname: "Alice Smith",
        phone: "1234567890",
        email: "alice@example.com",
        password: "hashedpassword1",
        currency_id: 1,
        country_id: null,
        refer_code: "REFALICE",
        created_by: null,
        status: "active",
        isAgreeWithTerms: true,
        isLoggedIn: true,
        isVerified: true,
        lastIp: "127.0.0.1",
        lastLogin: "2025-09-18T18:42:02.000Z",
        tokenVersion: 1,
        device_type: "Desktop",
        device_name: "Unknown",
        os_version: "Unknown",
        browser: "Unknown",
        browser_version: "Unknown",
        ip_address: "192.168.1.10",
        device_token: "token-alice-123",
        referred_by: null,
        referred_by_admin_user: null,
        created_at: "2025-09-14T20:35:12.000Z",
        kyc_status: "unverified",
      },
      adminUser: null,
      messages: [
        {
          id: 1,
          chatId: 1,
          senderId: 1,
          senderType: "user",
          messageType: "text",
          content: "hello world",
          attachmentUrl: null,
          isRead: false,
          createdAt: "2025-09-19T00:49:43.000Z",
          updatedAt: "2025-09-19T00:49:43.000Z",
        },
      ],
    },
    {
      id: 2,
      userId: 1,
      adminUserId: null,
      status: "open",
      type: "user",
      createdAt: "2025-09-19T01:01:04.000Z",
      updatedAt: "2025-09-19T01:01:04.000Z",
      user: {
        id: 1,
        username: "alice123",
        fullname: "Alice Smith",
        phone: "1234567890",
        email: "alice@example.com",
        password: "hashedpassword1",
        currency_id: 1,
        country_id: null,
        refer_code: "REFALICE",
        created_by: null,
        status: "active",
        isAgreeWithTerms: true,
        isLoggedIn: false,
        isVerified: true,
        lastIp: "127.0.0.1",
        lastLogin: "2025-09-18T18:42:02.000Z",
        tokenVersion: 1,
        device_type: "Desktop",
        device_name: "Unknown",
        os_version: "Unknown",
        browser: "Unknown",
        browser_version: "Unknown",
        ip_address: "192.168.1.10",
        device_token: "token-alice-123",
        referred_by: null,
        referred_by_admin_user: null,
        created_at: "2025-09-14T20:35:12.000Z",
        kyc_status: "unverified",
      },
      adminUser: null,
      messages: [
        {
          id: 2,
          chatId: 2,
          senderId: 1,
          senderType: "user",
          messageType: "text",
          content: "hello world from Jane",
          attachmentUrl: null,
          isRead: false,
          createdAt: "2025-09-19T01:01:04.000Z",
          updatedAt: "2025-09-19T01:01:04.000Z",
        },
      ],
    },
    // Add more chat data here following the same structure
  ];

  return (
    <div className="bg-[#07122b] overflow-y-auto min-w-[300px] border-r-[3px] border-[#01dc84]">
      <div className="p-[10px] py-2 border-b bg-[#07122b] z-[5] border-[#01dc844e] sticky top-0">
        {/* search bar  */}
        <div className="border border-[#01dc84] rounded-md bg-[#01dc8423]">
          <input
            type="text"
            className="w-full outline-none text-[14px] md:text-[16px] p-3 py-[7px] bg-transparent"
            placeholder="Search conversation..."
          />
        </div>
      </div>

      {/* all conversation highlight here */}
      <div>
        {chatData.map((chat, index) => (
          <ChatCard
            key={chat.id}
            name={chat.user.fullname}
            message={chat.messages.length > 0 ? chat.messages[0].content : "No messages"}
            time={formatTimeAgo(chat.createdAt)}
            avatar={ChatAvatar}
            isActive={activeChat === index}
            isUserActive={chat.user.isLoggedIn} // Assuming isLoggedIn indicates user activity
            onClick={() => setActiveChat(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SupportLeft;
