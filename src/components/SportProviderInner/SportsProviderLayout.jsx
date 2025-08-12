import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetRequest } from "../../Utils/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { API_LIST, BASE_URL } from "../../api/ApiList";
import { sportProviderOutsideRoute } from "../../Utils/menu";

const SportsProviderLayout = () => {
  const { sportProviderId } = useParams();
  const location = useLocation();
  const getRequest = useGetRequest();

  const { user, setSportProviderInfo } = useAuth();

  const {
    data: sportProviderDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sport_provider", sportProviderId],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_SPORT_PROVIDER,
        params: { id: sportProviderId || "-1" },
        errorMessage: "Failed to fetch sports provider profile",
      }),
    keepPreviousData: true,
    enabled: !!sportProviderId,
  });

  useEffect(() => {
    if (sportProviderDetails?.data && !isError) {
      setSportProviderInfo(sportProviderDetails.data);
    }
  }, [sportProviderDetails, isError, setSportProviderInfo]);

  const parentProvider = sportProviderDetails?.data?.parentId;

  const filteredRoutes = sportProviderOutsideRoute.filter((route) => {
    if (route.path.includes("child-provider-list") && parentProvider !== null) {
      return false;
    }
    return true;
  });
  // Dummy balances (could come from API)
  const HighlightBox = ({ label, value }) => {
    return (
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
            if (!sportProviderDetails?.data.parentId && label === "Sport List")
              return;
            const to = path.replace(":sportProviderId", sportProviderId);
            const isActive =
              path === "/sport-provider-list/:sportProviderId"
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
              value={sportProviderDetails?.data?.mainBalance}
            />
            <HighlightBox
              label="Total Expense"
              value={sportProviderDetails?.data?.totalExpense || 0}
            />
            <HighlightBox
              label="Minimum Limit"
              value={sportProviderDetails?.data?.minBalanceLimit}
            />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default SportsProviderLayout;
