import { useQuery } from "@tanstack/react-query";
import { useGetRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";

export const useDetailedAffiliateStats = (affiliateId) => {
    const getRequest = useGetRequest();

    return useQuery({
        queryKey: ["affiliateDetailedStats", affiliateId],
        queryFn: async () => {
            const res = await getRequest({
                url: `${BASE_URL}${API_LIST.GET_AFFILIATE_DETAILED_STATS}/${affiliateId}`,
                errorMessage: "Failed to fetch detailed affiliate stats",
            });
            return res?.data;
        },
        enabled: !!affiliateId,
    });
};
