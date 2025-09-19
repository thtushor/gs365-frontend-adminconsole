import React from "react";

const ChatCard = ({ name, message, time, avatar, isActive, isUserActive, onClick }) => {
  return (
    <div
      className={`flex relative items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e] ${
        isActive ? "bg-[#01dc8423]" : ""
      }`}
      onClick={onClick}
    >
      <img
        src={avatar}
        alt=""
        className={`w-[40px] h-[40px] border-2 rounded-full ${
          isActive ? "border-[#01dc84]" : "border-white/80"
        }`}
      />
      <div>
        <p className={`${isActive ? "text-[#01dc84]" : "text-white/80"} font-medium`}>{name}</p>
        <div className="mt-[-2px] relative pr-[65px] text-[14px] block truncate font-normal max-w-[220px]">
          <span className={`${isActive ? "text-white" : "text-white/70"}`}>{message}</span>
          <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
            ({time})
          </div>
        </div>
      </div>
      {isUserActive && (
        <div className="w-[10px] h-[10px] rounded-full bg-[#01dc84] absolute right-3" />
      )}
    </div>
  );
};

export default ChatCard;
