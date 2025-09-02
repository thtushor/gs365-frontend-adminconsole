import { useState, useEffect } from 'react';
import Axios from '../api/axios';
import { API_LIST } from '../api/ApiList';

export const useAdminBalance = () => {
  const [adminBalanceData, setAdminBalanceData] = useState({
    data: [],
    pagination: {},
    stats: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminBalance = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await Axios.get(API_LIST.ADMIN_MAIN_BALANCE, {
        params: {
          page: 1,
          pageSize: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          ...params
        }
      });

      if (response.data.success) {
        setAdminBalanceData(response.data);
      } else {
        setError(response.data.message || 'Failed to fetch admin balance data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching admin balance data');
    } finally {
      setLoading(false);
    }
  };

  const createAdminBalance = async (balanceData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await Axios.post(API_LIST.ADMIN_MAIN_BALANCE, balanceData);
      
      if (response.data.success) {
        // Refresh the data after successful creation
        await fetchAdminBalance();
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Failed to create admin balance record');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while creating admin balance record';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminBalance();
  }, []);

  return {
    adminBalanceData,
    loading,
    error,
    fetchAdminBalance,
    createAdminBalance,
    refetch: () => fetchAdminBalance()
  };
};
