import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useGetRequest } from "../Utils/apiClient";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useAuth } from "../hooks/useAuth";
import { hasPermission, PERMISSION_CATEGORIES } from "../Utils/permissions";
import { staticAffiliatePermission } from "../Utils/staticAffiliatePermission";
import { Spin, Tooltip } from "antd";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { BiCheck, BiCheckSquare, BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import { HelpCenterIconWithChatsCount } from "./HelpCenterIcon";
import { HighlightBox } from "./shared/HighlightBox";

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

  const { user, setAffiliateInfo } = useAuth();
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
    isSuccess: affiliateBalanceSuccess,
    isError: affiliateBalanceError,
  } = useQuery({
    queryKey: ["affiliateBalance", affiliateId],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL}${API_LIST.GET_AFFILIATE_BALANCE}/${affiliateId}`,
        errorMessage: "Failed to fetch affiliate balance details",
      }),
    // keepPreviousData: true,
    enabled: !!affiliateId,
  });

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
                    label="Total Profit"
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
                    label="Current Balance"
                    value={Number(
                      affiliateBalanceDetails?.data?.currentBalance || 0
                    ).toFixed(0)}
                    affiliateDetails={affiliateDetails}
                    tooltipTitle="(Total Profit - Total Loss - Lifetime Withdraw - Pending Withdrawal) = Current Balance"
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
                    label="Lifetime Withdraw"
                    value={Number(
                      affiliateBalanceDetails?.data?.lifetimeWithdraw || 0
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
                    affiliateDetails={affiliateDetails}
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
