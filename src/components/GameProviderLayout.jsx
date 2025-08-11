import {
  Link,
  Outlet,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useGetRequest } from "../Utils/apiClient";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useAuth } from "../hooks/useAuth";
import { gameProviderOutsideRoute } from "../Utils/menu";

const GameProviderLayout = () => {
  const navigate = useNavigate();
  const { gameProviderId } = useParams();
  const location = useLocation();
  const getRequest = useGetRequest();

  const { user, setGameProviderInfo } = useAuth();

  const {
    data: gameProviderDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["game_providers", gameProviderId],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
        params: { id: gameProviderId || "-1" },
        errorMessage: "Failed to fetch affiliate profile",
      }),
    keepPreviousData: true,
    enabled: !!gameProviderId,
  });

  useEffect(() => {
    if (gameProviderDetails?.data && !isError) {
      setGameProviderInfo(gameProviderDetails.data);
    }
  }, [gameProviderDetails, isError, setGameProviderInfo]);

  const parentProvider = gameProviderDetails?.data?.parentId;

  const filteredRoutes = gameProviderOutsideRoute.filter((route) => {
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
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-sm uppercase font-semibold border-green-500 border text-green-500 bg-green-100 px-2 w-fit rounded-md py-1">
          {`${
            parentProvider ? "Sub Provider Profile" : "Parent Provider Profile"
          }- ${gameProviderDetails?.data.name || "Unknown"}`}
        </h1>
        <button
          className="bg-green-500 text-white px-4 py-1 cursor-pointer rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={() =>
            navigate(
              `/add-game-provider?ref_parent_id=${gameProviderDetails?.data.id}`
            )
          }
        >
          + Add Sub Provider
        </button>
      </div>
      <nav className="bg-[#07122b] sticky top-[-24px] border-[#07122b] border-2 rounded-lg text-[#fff] font-medium py-[14px] px-3">
        <ul className="flex gap-4 flex-wrap">
          {filteredRoutes.map(({ label, path }) => {
            const to = path.replace(":gameProviderId", gameProviderId);
            const isActive =
              path === "/game-provider-list/:gameProviderId"
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
              value={gameProviderDetails?.data?.mainBalance}
            />
            <HighlightBox
              label="Total Expense"
              value={gameProviderDetails?.data?.totalExpense || 0}
            />
            <HighlightBox
              label="Minimum Limit"
              value={gameProviderDetails?.data?.minBalanceLimit}
            />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default GameProviderLayout;
