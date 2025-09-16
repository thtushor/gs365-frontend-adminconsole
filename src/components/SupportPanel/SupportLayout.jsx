import React from "react";
import SupportLeft from "./SupportLeft";
import SupportRight from "./SupportRight";
import { Link } from "react-router-dom";

const SupportLayout = () => {
  return (
    <div className="h-[82vh] pb-5">
      <div className="bg-[#07122b] mb-2 rounded-full py-1 px-1 w-fit flex gap-1">
        <Link className="bg-[#01dc84] px-4 font-semibold py-1 text-[14px] rounded-full">
          Player Conversation
        </Link>
        <Link className="text-white px-4 font-semibold py-1 text-[14px] rounded-full">
          Affiliate Conversation
        </Link>
      </div>
      <div className="bg-green-50 h-full text-white flex border border-[#07122b] rounded-xl overflow-hidden">
        <SupportLeft />
        <SupportRight />
      </div>
    </div>
  );
};

export default SupportLayout;
