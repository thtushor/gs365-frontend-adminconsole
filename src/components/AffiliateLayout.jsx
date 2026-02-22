import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useGetRequest } from "../Utils/apiClient";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useAuth } from "../hooks/useAuth";
import { hasPermission, PERMISSION_CATEGORIES } from "../Utils/permissions";
import { staticAffiliatePermission } from "../Utils/staticAffiliatePermission";
import { Spin } from "antd";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { BiCheck, BiCheckSquare, BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import { HelpCenterIconWithChatsCount } from "./HelpCenterIcon";

export const affiliateRoutes = [
  {
    label: "Profile",
    path: "/affiliate-list/:affiliateId",
    requiredPermission: "affiliate_view_affiliate_profile",
  },
  {
    label: "Sub Affiliates List",
    path: "/affiliate-list/:affiliateId/sub-affiliates-list",
    requiredPermission: "affiliate_view_sub_affiliate_list",
  },
  {
    label: "Player List",
    path: "/affiliate-list/:affiliateId/players-list",
    requiredPermission: "affiliate_view_affiliate_players",
  },
  {
    label: "Withdraw History",
    path: "/affiliate-list/:affiliateId/withdraw-history",
    requiredPermission: "affiliate_view_affiliate_withdraw_history",
  },
  // {
  //   label: "Sub Affiliate C. History",
  //   path: "/affiliate-list/:affiliateId/sub-affiliate-commission-history",
  // },
  {
    label: "Commission History",
    path: "/affiliate-list/:affiliateId/affiliate-commission-history",
    requiredPermission: "affiliate_view_affiliate_commissions",
  },
  {
    label: "KYC Verification",
    path: "/affiliate-list/:affiliateId/kyc-verification",
    requiredPermission: "affiliate_manage_kyc_verification",
  },
  {
    label: "Support",
    rightComponent: <HelpCenterIconWithChatsCount iconClassName={"text-white hover:text-black duration-300 w-4 opacity-0 h-4"} userType="affiliate" />,
    path: "/affiliate-list/:affiliateId/support",
    requiredPermission: "affiliate_support",
  },
];

const AffiliateLayout = () => {
  const { affiliateId } = useParams();
  const location = useLocation();
  const getRequest = useGetRequest();

  const { user, setAffiliateInfo, setAffiliateCommission } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];
  console.log(user);
  const {
    data: affiliateDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["affiliateProfile", affiliateId],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.AFFILIATE_PROFILE,
        params: { id: affiliateId || "-1", holderType: "affiliate" },
        errorMessage: "Failed to fetch affiliate profile",
      }),
    keepPreviousData: true,
    enabled: !!affiliateId,
  });

  const isSuperAffiliate =
    user?.role !== affiliateDetails?.data?.role &&
    user?.role === "superAffiliate";

  useEffect(() => {
    if (user?.kyc_status === "required") {
      if (!toast.isActive("kyc-toast")) {
        toast.error("Please complete KYC verification.", {
          toastId: "kyc-toast",
        });
      }
    }
  }, [user?.kyc_status]);

  const {
    data: affiliateBalanceDetails,
    isLoading: affiliateBalanceLoading,
    isError: affiliateBalanceError,
  } = useQuery({
    queryKey: ["affiliateBalance", affiliateId],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL}${API_LIST.GET_AFFILIATE_BALANCE}/${affiliateId}`,
        errorMessage: "Failed to fetch affiliate balance details",
      }),
    keepPreviousData: true,
    enabled: !!affiliateId,
  });

  useEffect(() => {
    if (affiliateBalanceDetails?.data) {
      setAffiliateCommission(affiliateBalanceDetails?.data);
    }
  }, [affiliateBalanceDetails?.data]);

  useEffect(() => {
    if (affiliateDetails?.data && !isError) {
      setAffiliateInfo(affiliateDetails.data);
    }
  }, [affiliateDetails?.data, isError, setAffiliateInfo]);

  const role = affiliateDetails?.data?.role;

  const filteredRoutes = affiliateRoutes.filter((route) => {
    if (
      (route.path.includes("sub-affiliates-list") ||
        route.path.includes("sub-affiliate-commission-history")) &&
      role === "affiliate"
    ) {
      return false;
    }
    if (isSuperAffiliate && route.label !== "Profile") {
      return false;
    }

    if (route.label === "Support") {
      console.log("role", role);
      if (user?.role !== "affiliate" && user?.role !== "superAffiliate") {
        return false;
      }
    }
    // Check if the user has the required permission for the route
    if (
      route.requiredPermission &&
      !staticAffiliatePermission(
        user?.role,
        permissions,
        route.requiredPermission
      )
    ) {
      return false;
    }

    return true;
  });
  // Dummy balances (could come from API)
  const HighlightBox = ({ label, value, role }) => {
    const handleShare = (type) => {
      const userReferCode = value || "N/A"; // fallback to default if no user data
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

    const [copied, setCopied] = useState(false);
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

    const [showTooltip, setShowTooltip] = useState(false);
    return label === "Referral Code" ? (
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
    ) : (
      <div
        className={`relative z-[1] ${label === "Total Earn"
          ? "bg-blue-500 text-white border-blue-500"
          : label === "Total Loss"
            ? "bg-red-500 text-white border-red-500"
            : label === "Lifetime Withdraw"
              ? "bg-blue-400 text-white border-blue-400"
              : label === "Current Balance"
                ? value > 0
                  ? "bg-green-400 text-white border-green-400"
                  : "bg-red-500 text-white border-red-500"
                : label === "Pending Withdrawal"
                  ? "bg-orange-400 text-white border-orange-400"
                  : "bg-white text-black"
          } border   p-3 py-2 rounded shadow-md w-full sm:w-fit`}
      >
        <div
          className={`text-xs font-medium ${label === "Total Earn" ||
            label === "Total Loss" ||
            label === "Lifetime Withdraw" ||
            label === "Current Balance" ||
            label === "Pending Withdrawal"
            ? "text-white"
            : "text-gray-600"
            }`}
        >
          {label}
        </div>
        <div className="text-[20px] font-bold truncate">{value || 0}</div>
        {
          label === "Current Balance" && (
            <>
              <div className="absolute top-[-11px] left-1/2 -translate-x-1/2 text-[10px] uppercase font-medium">
                {Number(value) >= Number(affiliateDetails?.data?.minTrx) &&
                  Number(value) <= Number(affiliateDetails?.data?.maxTrx) ? (
                  <div className="bg-green-100 border px-[6px] py-[2px] pt-[1px] rounded-full border-green-500 text-green-500">
                    Withdrawable
                  </div>
                ) : (
                  <p className="bg-red-100 border px-[6px] py-[2px] pt-[1px] rounded-full border-red-500 text-red-500">
                    Not Withdrawable
                  </p>
                )}
              </div>

              <div
                className="absolute bottom-[2px] right-[2px] text-[18px] text-white/70 cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HiMiniInformationCircle />
                {showTooltip && (
                  <div className="absolute top-full mb-1 right-0 bg-green-500 text-black font-semibold text-[12px] px-2 py-1 rounded shadow-md whitespace-nowrap">
                    (Total Earn - Total Loss - Lifetime Withdraw - Pending Withdrawal) = Current Balance
                  </div>
                )}
              </div>
            </>
          )
        }
      </div >
    );
  };

  return (
    <div>
      <nav className="bg-[#07122b] sticky top-[-24px] z-[5] border-[#07122b] border-2 rounded-lg text-[#fff] font-medium py-[14px] px-3 flex items-center justify-between md:flex-row flex-col gap-3 text-[12px] md:text-base">
        <ul className="flex gap-2 md:gap-4 flex-wrap">
          {filteredRoutes.map(({ label, rightComponent, path }) => {
            const to = path.replace(":affiliateId", affiliateId);
            const isActive =
              path === "/affiliate-list/:affiliateId"
                ? location.pathname === to
                : location.pathname === to ||
                location.pathname.startsWith(to + "/");

            return (
              <li key={label} className="relative">
                <Link
                  to={to}
                  className={`${isActive
                    ? "bg-green-400 text-black"
                    : "text-[#ffff] hover:text-black hover:bg-green-400"
                    }  px-2 py-1 rounded-[5px]  gap-2 flex items-center`}
                >
                  {label}
                  {
                    rightComponent
                  }
                </Link>
                {label === "KYC Verification" &&
                  affiliateDetails?.data?.kyc_status === "required" && (
                    <div className="absolute top-[-5px] right-[-10px] bg-orange-500 rounded-full">
                      <div className="band_alert"></div>
                    </div>
                  )}
              </li>
            );
          })}
        </ul>

        {user?.role !== "affiliate" && affiliateDetails?.data?.referDetails && (
          <Link
            to={`/affiliate-list/${affiliateDetails?.data?.referDetails?.id}`}
            className="block text-[12px] border px-2 py-1 rounded-full w-fit text-green-500 hover:bg-green-500 hover:text-black"
          >
            Back to Super Affiliate - (
            {affiliateDetails?.data?.referDetails?.fullname})
          </Link>
        )}
      </nav>

      <main className="p-4 bg-[#07122b] mt-5 rounded-lg">
        {isLoading || affiliateBalanceLoading ? (
          <div className="py-8 flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-4 mb-5">
            <div className="flex gap-4 flex-wrap whitespace-nowrap">
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_main_balance"
              ) && (
                  <HighlightBox
                    label="Total Earn"
                    value={Number(
                      affiliateBalanceDetails?.data?.lifetimeProfit || 0
                    ).toFixed(0)}
                  />
                )}
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_downline_balance"
              ) && (
                  <HighlightBox
                    label="Total Loss"
                    value={Number(
                      affiliateBalanceDetails?.data?.lifetimeLoss || 0
                    ).toFixed(0)}
                  />
                )}
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_withdrawable_balance"
              ) && (
                  <HighlightBox
                    label="Lifetime Withdraw"
                    value={Number(
                      affiliateBalanceDetails?.data?.lifetimeWithdraw || 0
                    ).toFixed(0)}
                  />
                )}
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_withdrawable_balance"
              ) && (
                  <HighlightBox
                    label="Pending Withdrawal"
                    value={Number(
                      affiliateBalanceDetails?.data?.pendingWithdrawal || 0
                    ).toFixed(0)}
                  />
                )}
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_withdrawable_balance"
              ) && (
                  <HighlightBox
                    label="Current Balance"
                    value={Number(
                      affiliateBalanceDetails?.data?.currentBalance || 0
                    ).toFixed(0)}
                  />
                )}
            </div>
            <div className="flex gap-4 flex-wrap whitespace-nowrap ">
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_commission_percentage"
              ) && (
                  <HighlightBox
                    label="Commission %"
                    value={`${affiliateDetails?.data?.commission_percent || 0}%`}
                  />
                )}
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_referral_code"
              ) && (
                  <HighlightBox
                    label="Referral Code"
                    value={affiliateDetails?.data?.refCode || "N/A"}
                    uplineDetails={affiliateDetails?.data?.role}
                  />
                )}
              {staticAffiliatePermission(
                user?.role,
                permissions,
                "affiliate_view_min_max_withdraw_limit"
              ) && (
                  <HighlightBox
                    label="Min-Max Withdraw Limit"
                    value={`${affiliateDetails?.data?.minTrx || 0} - ${affiliateDetails?.data?.maxTrx || 0
                      }`}
                  />
                )}
            </div>
          </div>
        )}
        <Outlet />
      </main >
    </div >
  );
};

export default AffiliateLayout;
