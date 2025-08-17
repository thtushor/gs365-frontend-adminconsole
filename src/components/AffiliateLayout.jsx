import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useGetRequest } from "../Utils/apiClient";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useAuth } from "../hooks/useAuth";

export const affiliateRoutes = [
  {
    label: "Profile",
    path: "/affiliate-list/:affiliateId",
  },
  {
    label: "Sub Affiliates List",
    path: "/affiliate-list/:affiliateId/sub-affiliates-list",
  },
  {
    label: "Player List",
    path: "/affiliate-list/:affiliateId/players-list",
  },
  {
    label: "Withdraw History",
    path: "/affiliate-list/:affiliateId/withdraw-history",
  },
  {
    label: "Sub Affiliate C. History",
    path: "/affiliate-list/:affiliateId/sub-affiliate-commission-history",
  },
  {
    label: "Player C. History",
    path: "/affiliate-list/:affiliateId/player-commission-history",
  },
];

const AffiliateLayout = () => {
  const { affiliateId } = useParams();
  const location = useLocation();
  const getRequest = useGetRequest();

  const { user, setAffiliateInfo } = useAuth();

  const {
    data: affiliateDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["affiliateProfile", affiliateId],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.AFFILIATE_PROFILE,
        params: { id: affiliateId || "-1" },
        errorMessage: "Failed to fetch affiliate profile",
      }),
    keepPreviousData: true,
    enabled: !!affiliateId,
  });

  useEffect(() => {
    if (affiliateDetails?.data && !isError) {
      setAffiliateInfo(affiliateDetails.data);
    }
  }, [affiliateDetails, isError, setAffiliateInfo]);

  const role = affiliateDetails?.data?.role;

  const filteredRoutes = affiliateRoutes.filter((route) => {
    if (
      (route.path.includes("sub-affiliates-list") ||
        route.path.includes("sub-affiliate-commission-history")) &&
      role === "affiliate"
    ) {
      return false;
    }
    return true;
  });
  // Dummy balances (could come from API)
  const HighlightBox = ({ label, value }) => {
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
    return label === "Referral Code" ? (
      <div className="border-[#07122b] border text-black bg-white p-4 py-2 rounded shadow-md w-full sm:w-fit">
        <div className="text-sm font-semibold text-gray-600">
          REF: <span className="text-green-500">{value || "N/A"}</span>
        </div>
        <div className="text-[14px] mt-[2px] font-semibold truncate flex gap-1">
          <button
            type="button"
            onClick={() => handleShare("player")}
            className="bg-green-300 hover:bg-green-500 px-2 text-center cursor-pointer rounded-md"
          >
            Player
          </button>
          <button
            type="button"
            onClick={() => handleShare("affiliate")}
            className="bg-green-300 hover:bg-green-500 px-2 text-center cursor-pointer rounded-md"
          >
            Affiliate
          </button>
        </div>
      </div>
    ) : (
      <div className="border-[#07122b] border text-black bg-white p-4 py-2 rounded shadow-md w-full sm:w-fit">
        <div className="text-xs font-medium text-gray-600">{label}</div>
        <div className="text-[20px] font-semibold truncate">{value || 0}</div>
      </div>
    );
  };

  return (
    <div>
      <nav className="bg-[#07122b] sticky top-[-24px] border-[#07122b] border-2 rounded-lg text-[#fff] font-medium py-[14px] px-3">
        <ul className="flex gap-4 flex-wrap">
          {filteredRoutes.map(({ label, path }) => {
            const to = path.replace(":affiliateId", affiliateId);
            const isActive =
              path === "/affiliate-list/:affiliateId"
                ? location.pathname === to
                : location.pathname === to ||
                  location.pathname.startsWith(to + "/");

            return (
              <li key={label}>
                <Link
                  to={to}
                  className={`${
                    isActive
                      ? "bg-green-400 text-black"
                      : "text-[#ffff] hover:text-black hover:bg-green-400"
                  }  px-2 py-1 rounded-[5px]`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="p-4 bg-[#07122b] mt-5 rounded-lg">
        <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-4 mb-5">
          <div className="flex gap-4 flex-wrap whitespace-nowrap">
            <HighlightBox
              label="Main Balance"
              value={affiliateDetails?.data?.main_balance}
            />
            <HighlightBox
              label="Downline Balance"
              value={affiliateDetails?.data?.downline_balance}
            />
            <HighlightBox
              label="Withdrawable Balance"
              value={affiliateDetails?.data?.withdrawable_balance}
            />
          </div>
          <div className="flex gap-4 flex-wrap whitespace-nowrap ">
            <HighlightBox
              label="Commission %"
              value={`${affiliateDetails?.data?.commission_percent || 0}%`}
            />
            <HighlightBox
              label="Referral Code"
              value={affiliateDetails?.data?.refCode || "N/A"}
            />
            <HighlightBox
              label="Min-Max Withdraw Limit"
              value={`${affiliateDetails?.data?.minTrx || 0} - ${
                affiliateDetails?.data?.maxTrx || 0
              }`}
            />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AffiliateLayout;
