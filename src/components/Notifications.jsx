import React, { useMemo, useState } from "react";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import ReusableModal from "./ReusableModal";
import { useAuth } from "../hooks/useAuth";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { formatDate } from "../Utils/dateUtils";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hasPermission } from "../Utils/permissions";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" },
];

const notificationTypeOptions = [
  { value: "claimable", label: "Claimable" },
  { value: "linkable", label: "Linkable" },
  { value: "static", label: "Static" },
];

const defaultFilters = {
  page: 1,
  pageSize: 20,
  status: "",
  search: "",
  notificationType: "",
};

const NotificationList = ({ title = "Notifications" }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");

  const queryClient = useQueryClient();
  const getRequest = useGetRequest();
  const postRequest = usePostRequest();

  // ---------------- Fetch Notifications ----------------
  const { data: notificationData, isLoading: notificationListLoading } =
    useQuery({
      queryKey: ["notifications", filters],
      queryFn: () =>
        getRequest({
          url: BASE_URL + API_LIST.GET_NOTIFICATION,
          params: filters,
        }),
    });

  // ---------------- Update Notification Status ----------------
  const updateNotificationMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await postRequest({
        url: `${BASE_URL}${API_LIST.UPDATE_NOTIFICATION_STATUS}`,
        body: { id, status },
        contentType: "application/json",
      });
    },
    onSuccess: () => {
      setViewModalOpen(false);
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (err) => {
      console.error("Update failed:", err);
    },
  });

  const columns = useMemo(
    () => [
      {
        field: "sl",
        headerName: "SL",
        width: 60,
        render: (_, __, index) =>
          (filters.page - 1) * filters.pageSize + index + 1,
      },
      { field: "title", headerName: "Title", width: 250 },
      {
        field: "notificationType",
        headerName: "Type",
        width: 150,
        render: (value) => (
          <span className="capitalize font-medium">{value}</span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        render: (_, row) => (
          <span
            className={`px-3 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
              row.status === "active"
                ? "bg-green-100 text-green-800"
                : row.status === "inactive"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.status}
          </span>
        ),
      },
      {
        field: "startDate",
        headerName: "Start Date",
        width: 180,
        render: (value) => (value ? formatDate(value) : "-"),
      },
      {
        field: "endDate",
        headerName: "End Date",
        width: 180,
        render: (value) => (value ? formatDate(value) : "-"),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 180,
        render: (value) => (value ? formatDate(value) : "-"),
      },
      {
        field: "action",
        headerName: "Action",
        width: 120,
        align: "center",
        render: (value, row) =>
          (isSuperAdmin ||
            hasPermission(permissions, "notification_update")) && (
            <button
              className="px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs"
              onClick={() => handleEditNotification(row)}
            >
              Edit Status
            </button>
          ),
      },
    ],
    [isSuperAdmin, permissions]
  );

  const handleEditNotification = (notification) => {
    setSelectedNotification(notification);
    setSelectedStatus(notification.status || "active");
    setViewModalOpen(true);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Search by title"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
            }
          />
          <select
            className="border rounded px-3 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))
            }
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2"
            value={filters.notificationType}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                notificationType: e.target.value,
                page: 1,
              }))
            }
          >
            <option value="">All Types</option>
            {notificationTypeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable
          columns={columns}
          data={notificationData?.data}
          isLoading={isLoading || notificationListLoading}
          isSuperAdmin={isSuperAdmin}
          permissions={permissions}
          exportPermission="notification_view"
        />
        <Pagination
          currentPage={filters.page}
          totalPages={Math.max(
            1,
            Math.ceil((pagination.total || 0) / filters.pageSize)
          )}
          pageSize={filters.pageSize}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onPageSizeChange={(ps) =>
            setFilters((f) => ({ ...f, pageSize: ps, page: 1 }))
          }
        />
      </div>

      {/* Edit Status Modal */}
      <ReusableModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Edit Status #${selectedNotification?.id}`}
        size="sm"
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <select
                className="border rounded outline-none bg-green-100 text-green-600 border-green-500 px-3 py-2 w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
              onClick={() =>
                updateNotificationMutation.mutate({
                  id: selectedNotification.id,
                  status: selectedStatus,
                })
              }
              disabled={updateNotificationMutation.isLoading}
            >
              {updateNotificationMutation.isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        )}
      </ReusableModal>
    </div>
  );
};

export default NotificationList;
