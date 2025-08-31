import CreateFeaturedGames from "./CreateFeaturedGames";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";

const FeaturedGames = () => {
  const getRequest = useGetRequest();

  // Fetch the existing featured game (id = 1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["featuredGame"],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_FEATURED_GAME,
        errorMessage: "Failed to fetch featured game",
      }),
  });

  return (
    <div className="w-full p-5 bg-white rounded-xl border border-green-300">
      <CreateFeaturedGames bannerToEdit={data?.data} onSuccess={() => {}} />
    </div>
  );
};

export default FeaturedGames;
