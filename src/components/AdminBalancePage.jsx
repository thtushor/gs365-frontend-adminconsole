import React, { useState, useEffect } from 'react';
import { useAdminBalance } from '../hooks/useAdminBalance';
import { useAuth } from '../hooks/useAuth';
import ReusableModal from './ReusableModal';
import  PageHeader  from './shared/PageHeader';
import StatCard  from './shared/StatCard';
import LoadingState from './shared/LoadingState';
import ErrorState from './shared/ErrorState';
import EmptyState  from './shared/EmptyState';
import StatusChip from './shared/StatusChip';
import Pagination from './Pagination';

const AdminBalancePage = () => {
  const { adminBalanceData, loading, error, fetchAdminBalance, createAdminBalance } = useAdminBalance();
  const { user } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'admin_deposit',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    createdByAdmin: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  });

  const balanceTypes = [
    { value: 'admin_deposit', label: 'Admin Deposit' },
    { value: 'admin_withdraw', label: 'Admin Withdraw' },
    { value: 'player_deposit', label: 'Player Deposit' },
    { value: 'player_withdraw', label: 'Player Withdraw' },
    { value: 'promotion', label: 'Promotion' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      amount: parseFloat(formData.amount),
      type: 'admin_deposit',
      currencyId: 1, // Default currency ID
      createdByPlayer: null,
      createdByAdmin: user?.id,
      notes: formData.notes.trim()
    };

    const result = await createAdminBalance(submitData);
    
    if (result.success) {
      setShowForm(false);
      setFormData({
        amount: '',
        type: 'admin_deposit',
        notes: ''
      });
      setFormErrors({});
      fetchAdminBalance({
        ...filters,
        ...pagination
      });
    }
    
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setFormData({
      amount: '',
      type: 'admin_deposit',
      notes: ''
    });
    setFormErrors({});
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchAdminBalance({
      ...filters,
      ...pagination,
      page: 1
    });
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      createdByAdmin: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setPagination({ page: 1, pageSize: 10 });
    fetchAdminBalance({ page: 1, pageSize: 10 });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchAdminBalance({
      ...filters,
      ...pagination,
      page: newPage
    });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
    fetchAdminBalance({
      ...filters,
      pageSize: newPageSize,
      page: 1
    });
  };



  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'admin_deposit':
      case 'player_deposit':
        return 'success';
      case 'admin_withdraw':
      case 'player_withdraw':
        return 'danger';
      case 'promotion':
        return 'warning';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    fetchAdminBalance({
      ...filters,
      ...pagination
    });
  }, [pagination.page, pagination.pageSize]);

  if (loading && !adminBalanceData.data.length) {
    return <LoadingState message="Loading admin balance data..." />;
  }

  if (error && !adminBalanceData.data.length) {
    return <ErrorState message={error} onRetry={() => fetchAdminBalance()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Balance Management"
        subtitle="Manage and track admin main balance transactions"
        actions={[
          {
            label: 'Add Record',
            onClick: () => setShowForm(true),
            variant: 'primary'
          }
        ]}
      />

      {/* Stats Cards */}
      {adminBalanceData.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard
            title="Current Balance"
            value={formatCurrency(adminBalanceData.stats.currentMainBalance)}
            icon="💰"
            color="primary"
          />
          <StatCard
            title="Total Admin Deposits"
            value={formatCurrency(adminBalanceData.stats.totalAdminDeposit)}
            icon="📈"
            color="success"
          />
          <StatCard
            title="Total Player Deposits"
            value={formatCurrency(adminBalanceData.stats.totalPlayerDeposit)}
            icon="👥"
            color="info"
          />
          <StatCard
            title="Total Promotions"
            value={formatCurrency(adminBalanceData.stats.totalPromotion)}
            icon="🎁"
            color="warning"
          />
          <StatCard
            title="Total Player Withdrawals"
            value={formatCurrency(adminBalanceData.stats.totalPlayerWithdraw)}
            icon="💸"
            color="danger"
          />
          <StatCard
            title="Total Admin Withdrawals"
            value={formatCurrency(adminBalanceData.stats.totalAdminWithdraw)}
            icon="📉"
            color="danger"
          />
          <StatCard
            title="Total Records"
            value={adminBalanceData.stats.totalRecords}
            icon="📊"
            color="secondary"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {balanceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminBalanceData.data?.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{record.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip
                      status={record.type}
                      variant={getTypeColor(record.type)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.createdByAdminUser ? (
                      <div>
                        <div className="font-medium">{record.createdByAdminUser.fullname}</div>
                        <div className="text-gray-500 text-xs">{record.createdByAdminUser.username}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {record.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {adminBalanceData.data?.length === 0 && (
          <EmptyState
            title="No admin balance records found"
            description="No records match your current filters. Try adjusting your search criteria."
          />
        )}

        {adminBalanceData.pagination && adminBalanceData.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={adminBalanceData.pagination.page}
              totalPages={adminBalanceData.pagination.totalPages}
              pageSize={adminBalanceData.pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ReusableModal
        open={showForm}
        onClose={handleCloseModal}
        title="Add Admin Balance Record"
        onSave={handleFormSubmit}
        isLoading={isSubmitting}
        loadingText="Creating..."
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleFormInputChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
            />
            {formErrors.amount && (
              <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
            )}
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes *
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter notes for this transaction"
            />
            {formErrors.notes && (
              <p className="text-red-500 text-xs mt-1">{formErrors.notes}</p>
            )}
          </div>
        </div>
      </ReusableModal>
    </div>
  );
};

export default AdminBalancePage;
