import React from "react";
import { FaPaperclip } from "react-icons/fa"; // Import paperclip icon

const ChatCard = ({ name, message="", time, avatar, isActive, isUserActive,chatStatus, hasAttachment, onClick }) => {
  const displayMessage = message.length > 50 ? message.substring(0, 47) + "..." : message;

  return (
    <div
      className={`flex relative items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e] ${isActive ? "bg-[#01dc8423]" : ""
        }`}
      onClick={onClick}
    >
      <img
        src={avatar}
        alt=""
        className={`w-[40px] h-[40px] border-2 rounded-full ${isActive ? "border-[#01dc84]" : "border-white/80"
          }`}
      />
      <div className="flex-1"> {/* Use flex-1 to make this div take available space */}
        <div className="flex justify-between items-center"> {/* Flex container for name and time */}
          <div className="flex gap-2 items-center">
            <p className={`${isActive ? "text-[#01dc84]" : "text-white/80"} ${chatStatus==="pending_admin_response" ? "!font-bold":""} font-medium`}>{name}</p>
            {isUserActive && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#01dc84]" />
            )}
          </div>
          {time && message && ( // Only show time if it exists
            <div className="text-[12px] text-white/90 italic">
              ({time})
            </div>
          )}
        </div>
        <div className="mt-[-2px] text-[14px] truncate font-normal max-w-[220px] flex items-center gap-1">
          {hasAttachment && <FaPaperclip className={`${isActive ? "text-white" : "text-white/70"} text-xs`} />}
          <span className={`${isActive ? "text-white" : "text-white/70"} ${chatStatus==="pending_admin_response" ? "!font-bold":""}`}>{displayMessage||"No conversations"}</span>
        </div>
      </div>

    </div>
  );
};

export default ChatCard;
