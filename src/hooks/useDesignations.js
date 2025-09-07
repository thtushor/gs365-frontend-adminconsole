import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Axios from '../api/axios';
import { API_LIST } from '../api/ApiList';
import { toast } from 'react-toastify';

// Query keys
export const DESIGNATION_QUERY_KEYS = {
    all: ['designations'],
    lists: () => [...DESIGNATION_QUERY_KEYS.all, 'list'],
    list: (filters) => [...DESIGNATION_QUERY_KEYS.lists(), { filters }],
    details: () => [...DESIGNATION_QUERY_KEYS.all, 'detail'],
    detail: (id) => [...DESIGNATION_QUERY_KEYS.details(), id],
};

// Get all designations
export const useDesignations = (params = {}) => {
    return useQuery({
        queryKey: DESIGNATION_QUERY_KEYS.list(params),
        queryFn: async () => {
            const response = await Axios.get(API_LIST.PERMISSION, { params });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Get designation by ID
export const useDesignation = (id) => {
    return useQuery({
        queryKey: DESIGNATION_QUERY_KEYS.detail(id),
        queryFn: async () => {
            const response = await Axios.get(`${API_LIST.PERMISSION}/${id}`);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Create designation mutation
export const useCreateDesignation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (designationData) => {
            const response = await Axios.post(API_LIST.PERMISSION, designationData);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: DESIGNATION_QUERY_KEYS.lists() });
            toast.success('Designation created successfully!');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to create designation';
            toast.error(message);
        },
    });
};

// Update designation mutation
export const useUpdateDesignation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...designationData }) => {
            const response = await Axios.post(`${API_LIST.PERMISSION}/update/${id}`, designationData);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DESIGNATION_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DESIGNATION_QUERY_KEYS.detail(variables.id) });
            toast.success('Designation updated successfully!');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to update designation';
            toast.error(message);
        },
    });
};

// Delete designation mutation
export const useDeleteDesignation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await Axios.post(`${API_LIST.PERMISSION}/delete/${id}`);
            return response.data;
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: DESIGNATION_QUERY_KEYS.lists() });
            queryClient.removeQueries({ queryKey: DESIGNATION_QUERY_KEYS.detail(id) });
            toast.success('Designation deleted successfully!');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to delete designation';
            toast.error(message);
        },
    });
};