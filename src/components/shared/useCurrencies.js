// useCurrencies.js

import { useQuery } from "@tanstack/react-query";
import { useGetRequest } from "../../Utils/apiClient";
import { API_LIST, BASE_URL } from "../../api/ApiList";

export const useCurrencies = (filters = {}) => {
  const getRequest = useGetRequest();
  return useQuery({
    queryKey: ["currencies", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_CURRENCIES,params: filters,
        errorMessage: "Failed to fetch currency list",
      }),
    select: (res) => res?.data || [],
    keepPreviousData: true,
  });
};
