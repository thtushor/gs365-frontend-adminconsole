import React from "react";
import ChatAvatar from "../../assets/chat-avatar.png";
import { LuSend } from "react-icons/lu";
import { TiAttachment } from "react-icons/ti";
import { useAuth } from "../../hooks/useAuth";

const SupportRight = ({ isAffiliate }) => {
  const { user } = useAuth();
  return (
    <div className="text-[#07122b] w-full relative ">
      {/* top */}
      <div className="p-4 py-[9.5px] flex items-center gap-2 border-b-2 border-[#01dc84] text-white bg-[#07122b]">
        <img
          src={ChatAvatar}
          alt=""
          className="w-[35px] h-[35px] border rounded-md bg-white border-white"
        />
        <div>
          <h1 className="flex items-center mt-[-2px] text-[#01dc84] gap-1 font-semibold">
            John Smith{" "}
            <span className="text-[12px] bg-[#01dc84] px-[6px] text-white leading-4 block rounded-full">
              {isAffiliate
                ? user?.role === "affiliate"
                  ? "Affiliate"
                  : user?.role === "superAffiliate"
                  ? "Super Affiliate"
                  : "Player"
                : "Player"}
            </span>
          </h1>
          <p className="text-[12px] mt-[-3px] text-white/80">
            example@gmail.com
          </p>
        </div>
      </div>

      {/* center */}
      <div className="p-4 py-2 h-full overflow-y-auto max-h-[70vh] space-y-1">
        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>

        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>
        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>
        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>

        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>
        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>
        {/* Receiver message */}
        <div className="flex flex-col items-start">
          <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            Hello! How are you doing today?
          </div>
          <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
        </div>

        {/* Sender message */}
        <div className="flex flex-col items-end">
          <div className="bg-[#01dc84] text-white px-4 py-2 rounded-lg max-w-xs md:max-w-sm">
            {"I'm"} good, thanks! How about you?
          </div>
          <span className="text-xs text-gray-400 mt-1">10:33 AM</span>
        </div>
      </div>

      {/* bottom */}
      <div className="p-2 py-2 flex items-center gap-2 sticky bottom-0 w-full bg-[#07122b] border-t-2 border-[#01dc84]">
        <div className="header-auth">
          <div className="signup-btn-green !cursor-pointer !text-[27px] !min-w-[40px] !max-w-[40px] !p-0 flex items-center justify-center !border-[2px] !max-h-[40px] !min-h-[40px]">
            <TiAttachment />
          </div>
        </div>
        <div className="flex w-full">
          <input
            placeholder="What's on your mind?"
            className="border border-[#01dc84] text-white placeholder:text-white/70 placeholder:font-normal w-full rounded-l-md px-3 outline-none font-medium"
          />
          <div className="header-auth">
            <div className="signup-btn-green  !cursor-pointer !min-w-[40px] !rounded-l-none !rounded-md !max-w-[40px] !p-0 flex items-center justify-center !border-[2px] !max-h-[40px] !min-h-[40px]">
              <LuSend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportRight;
