import React, { useState } from "react";
import { BiCheckSquare, BiCopy } from "react-icons/bi";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { Tooltip } from "antd";
import { toast } from "react-toastify";

export const HighlightBox = ({ label, value, affiliateDetails, tooltipTitle, color }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = (type) => {
        const userReferCode = value || "N/A";
        const affiliateReferralLink = `https://gamestar365.com/affiliate-signup?refCode=${userReferCode}`;
        const playerReferralLink = `https://gamestar365.com/register?refCode=${userReferCode}`;
        if (navigator.share) {
            navigator
                .share({
                    title: "Gamestar 365",
                    text: "Check out this link!",
                    url: type === "player" ? playerReferralLink : affiliateReferralLink,
                })
                .then(() => console.log("Link shared successfully"))
                .catch((error) => console.error("Error sharing", error));
        } else {
            alert("Share not supported on this browser.");
        }
    };

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success("Referral code copied to clipboard!");
            setTimeout(() => setCopied(false), 1200);
        } catch (e) {
            setCopied(false);
        }
    };

    if (label === "Referral Code") {
        return (
            <div className="border-[#07122b] border text-black bg-white p-3 py-2 rounded shadow-md w-full sm:w-fit">
                <div
                    onClick={() => handleCopy(value)}
                    className="text-sm flex cursor-pointer items-center gap-1 font-semibold text-gray-600 relative"
                >
                    REF: <span className="text-green-500">{value || "N/A"}</span>{" "}
                    <span className="text-green-500 cursor-pointer text-[16px]">
                        {copied ? <BiCheckSquare color="orange" /> : <BiCopy />}
                    </span>
                </div>
                <div className="text-[14px] mt-[2px] font-semibold truncate flex gap-1">
                    <button
                        type="button"
                        onClick={() => handleShare("player")}
                        className="bg-green-300 hover:bg-green-500 px-2 text-center cursor-pointer rounded-md"
                    >
                        Player{" "}
                        <span>
                            {affiliateDetails?.data?.role === "superAffiliate" ? "" : "Refer"}
                        </span>
                    </button>
                    {affiliateDetails?.data?.role === "superAffiliate" && (
                        <button
                            type="button"
                            onClick={() => handleShare("affiliate")}
                            className="bg-green-300 hover:bg-green-500 px-2 text-center cursor-pointer rounded-md"
                        >
                            Affiliate
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const getCardStyle = () => {
        if (color) return color;
        switch (label) {
            case "Total Earn":
            case "Total Commission":
                return "bg-blue-500 text-white border-blue-500";
            case "Total Loss":
            case "Total Rejected Withdraw":
                return "bg-red-500 text-white border-red-500";
            case "Lifetime Withdraw":
            case "Total Withdraw":
            case "Total Settled Commission":
            case "Total Settled Withdraw":
                return "bg-blue-400 text-white border-blue-400";
            case "Current Balance":
                return value > 0 ? "bg-green-400 text-white border-green-400" : "bg-red-500 text-white border-red-500";
            case "Pending Withdrawal":
            case "Total Pending Withdraw":
                return "bg-orange-400 text-white border-orange-400";
            default:
                return "bg-white text-black border-gray-200";
        }
    };

    return (
        <div className={`relative z-[1] ${getCardStyle()} border p-3 py-2 rounded shadow-md w-full sm:w-fit min-w-[150px]`}>
            <div className={`text-xs font-medium ${getCardStyle().includes("text-white") ? "text-white" : "text-gray-600"}`}>
                {label}
            </div>
            <div className="text-[20px] font-bold truncate">{value || 0}</div>
            {label === "Current Balance" && (
                <div className="absolute top-[-11px] left-1/2 -translate-x-1/2 text-[10px] uppercase font-medium">
                    {Number(value) >= Number(affiliateDetails?.data?.minTrx) &&
                        Number(value) <= Number(affiliateDetails?.data?.maxTrx) ? (
                        <div className="bg-green-100 border px-[6px] py-[2px] pt-[1px] rounded-full border-green-500 text-green-500 shadow-sm">
                            Withdrawable
                        </div>
                    ) : (
                        <p className="bg-red-100 border px-[6px] py-[2px] pt-[1px] rounded-full border-red-500 text-red-500 shadow-sm">
                            Not Withdrawable
                        </p>
                    )}
                </div>
            )}
            {tooltipTitle && (
                <div className="absolute bottom-[2px] right-[2px] text-[18px] text-white/70 cursor-pointer">
                    <Tooltip
                        title={tooltipTitle}
                        placement="bottomRight"
                        color="rgb(34, 197, 94)"
                        overlayInnerStyle={{
                            color: "black",
                            fontWeight: "600",
                            fontSize: "12px",
                        }}
                        showArrow={false}
                    >
                        <HiMiniInformationCircle />
                    </Tooltip>
                </div>
            )}
        </div>
    );
};
