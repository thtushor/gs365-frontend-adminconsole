import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";

export const QUERY_KEYS = {
    REJECT_REASONS: "reject-reasons",
};

export const useRejectReasons = (filters = {}) => {
    const queryClient = useQueryClient();

    const getRejectReasons = useQuery({
        queryKey: [QUERY_KEYS.REJECT_REASONS, filters],
        queryFn: async () => {
            const { data } = await Axios.get(API_LIST.GET_REJECT_REASONS, {
                params: filters,
            });
            return data;
        },
    });

    const createRejectReason = useMutation({
        mutationFn: async (data) => {
            const { data: resData } = await Axios.post(
                API_LIST.CREATE_REJECT_REASON,
                data,
            );
            return resData;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.REJECT_REASONS]);
            toast.success(data.message || "Reject reason created successfully");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to create reject reason",
            );
        },
    });

    const updateRejectReason = useMutation({
        mutationFn: async ({ id, ...data }) => {
            const { data: resData } = await Axios.post(
                `${API_LIST.UPDATE_REJECT_REASON}/${id}`,
                data,
            );
            return resData;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.REJECT_REASONS]);
            toast.success(data.message || "Reject reason updated successfully");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to update reject reason",
            );
        },
    });

    const deleteRejectReason = useMutation({
        mutationFn: async (id) => {
            const { data: resData } = await Axios.post(
                `${API_LIST.DELETE_REJECT_REASON}/${id}`,
            );
            return resData;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.REJECT_REASONS]);
            toast.success(data.message || "Reject reason deleted successfully");
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to delete reject reason",
            );
        },
    });

    return {
        getRejectReasons,
        createRejectReason,
        updateRejectReason,
        deleteRejectReason,
    };
};
