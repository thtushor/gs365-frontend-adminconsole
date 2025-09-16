import React from "react";
import ChatAvatar from "../../assets/chat-avatar.png";

const SupportLeft = () => {
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
        <div className="flex relative items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-[#01dc84]"
          />
          <div>
            <p className="text-[#01dc84] font-medium">John Smith</p>
            <div className="mt-[-2px] relative pr-[65px] text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>

          <div className="w-[10px] h-[10px] rounded-full bg-[#01dc84] absolute right-3" />
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex relative items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-[#01dc84]"
          />
          <div>
            <p className="text-[#01dc84] font-medium">John Smith</p>
            <div className="mt-[-2px] relative pr-[65px] text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>

          <div className="w-[10px] h-[10px] rounded-full bg-[#01dc84] absolute right-3" />
        </div>
        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center hover:bg-[#01dc8423] duration-150 cursor-pointer gap-2 p-[10px] py-2 border-b border-[#01dc844e]">
          <img
            src={ChatAvatar}
            alt=""
            className="w-[40px] h-[40px] border-2 rounded-full border-white/80"
          />
          <div>
            <p className="text-white/80 font-medium">John Smith</p>
            <div className="mt-[-2px] pr-[65px] relative text-[14px] block truncate font-normal max-w-[220px]">
              <span className="text-white/70">
                Something we need for more information to the shops
              </span>
              <div className="text-[12px] text-white/90 italic absolute right-1 top-[2px]">
                (9 min ago)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportLeft;
