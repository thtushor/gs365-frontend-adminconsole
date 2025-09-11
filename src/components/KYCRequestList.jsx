import React, { useMemo, useState } from "react";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import ReusableModal from "./ReusableModal";
import { useAuth } from "../hooks/useAuth";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { formatDate } from "../Utils/dateUtils";
import { useGetRequest, usePostRequest } from "../Utils/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { hasPermission, hasAnyPermission } from "../Utils/permissions";

const statusOptions = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const defaultFilters = {
  page: 1,
  pageSize: 20,
  status: "",
  search: "",
};

const KYCRequestList = ({ title = "KYC List" }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "superAdmin";
  const permissions = user?.designation?.permissions || [];

  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedKyc, setSelectedKyc] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const queryClient = useQueryClient();
  const getRequest = useGetRequest();
  const postRequest = usePostRequest();

  // ---------------- Fetch KYC List ----------------
  const { data: kycDataList, isLoading: kycListLoading } = useQuery({
    queryKey: ["kyc", filters],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_ALL_KYC,
        params: filters,
      }),
  });

  // ---------------- Update KYC Status ----------------
  const updateKycMutation = useMutation({
    mutationFn: async ({ kycId, holderId, status, holderType }) => {
      return await postRequest({
        url: `${BASE_URL}${API_LIST.UPDATE_KYC_STATUS}`,
        body: { kycId, holderId, status, holderType },
        contentType: "application/json",
      });
    },
    onSuccess: () => {
      setViewModalOpen(false);
      queryClient.invalidateQueries(["kyc"]);
      window.location.reload();
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
      { field: "holderType", headerName: "Holder Type", width: 120 },
      {
        field: "holderUsername",
        headerName: "Username",
        width: 180,
        render: (_, row) => (
          <Link
            to={
              row?.holderType === "player"
                ? `/players/${row?.holderId}/profile`
                : `/affiliate-list/${row?.holderId}`
            }
            className="text-green-500 cursor-pointer font-semibold"
          >
            {row?.holderUsername}
          </Link>
        ),
      },
      { field: "fullName", headerName: "Full Name", width: 150 },
      { field: "holderEmail", headerName: "Email Address", width: 200 },
      { field: "documentType", headerName: "Document Type", width: 150 },
      { field: "documentNo", headerName: "Document Number", width: 150 },
      {
        field: "holderKycStatus",
        headerName: "Holder KYC Status",
        width: 150,
        render: (_, row) => (
          <span
            className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
              row.holderKycStatus === "verified"
                ? "bg-green-100 text-green-800"
                : row.holderKycStatus === "required"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.holderKycStatus}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        render: (_, row) => (
          <span
            className={`px-3 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
              row.status === "approved"
                ? "bg-green-100 text-green-800"
                : row.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.status}
          </span>
        ),
      },
      {
        field: "created_at",
        headerName: "Created At",
        width: 180,
        render: (value) => (value ? formatDate(value) : "-"),
      },
      {
        field: "updated_at",
        headerName: "Last Update",
        width: 180,
        render: (value) => (value ? formatDate(value) : "-"),
      },
      {
        field: "action",
        headerName: "Action",
        width: 120,
        align: "center",
        render: (value, row) =>
          (isSuperAdmin || hasPermission(permissions, "kyc_view_kyc_requests")) && (
            <button
              className="px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs"
              onClick={() => handleViewKyc(row)}
            >
              View
            </button>
          ),
      },
    ],
    [isSuperAdmin, permissions]
  );

  const handleViewKyc = (kyc) => {
    setSelectedKyc(kyc);
    setSelectedStatus(kyc.status || "pending");
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
            placeholder="Search by document number"
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <DataTable
          columns={columns}
          data={kycDataList?.data}
          isLoading={isLoading || kycListLoading}
          isSuperAdmin={isSuperAdmin}
          permissions={permissions}
          exportPermission="kyc_view_kyc_history"
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

      {/* KYC Details Modal */}
      <ReusableModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`KYC Details #${selectedKyc?.id}`}
        size="lg"
        className="max-h-[80vh] !max-w-[80vw] overflow-y-auto"
      >
        {selectedKyc && (
          <div className="space-y-4">
            {/* KYC Info */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-[10px]">
                <h4 className="font-bold text-gray-800">KYC Information</h4>

                {(isSuperAdmin ||
                  hasAnyPermission(permissions, [
                    "kyc_approve_kyc",
                    "kyc_reject_kyc",
                  ])) && (
                  <div className="flex gap-2 items-center">
                    <select
                      className="border rounded outline-none bg-green-100 text-green-500 border-green-500 px-3 py-0 pb-1"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="px-3 py-1 text-[14px] bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() =>
                        updateKycMutation.mutate({
                          kycId: selectedKyc.id,
                          holderId: selectedKyc.holderId,
                          status: selectedStatus,
                          holderType: selectedKyc.holderType,
                        })
                      }
                      disabled={updateKycMutation.isLoading}
                    >
                      {updateKycMutation.isLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Holder Type:</span>
                  <span className="font-medium">{selectedKyc.holderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Holder ID:</span>
                  <span className="font-medium">{selectedKyc.holderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Holder Username:</span>
                  <span className="font-medium">
                    {selectedKyc.holderUsername || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Holder Email:</span>
                  <span className="font-medium">
                    {selectedKyc.holderEmail || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium">{selectedKyc.dob || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Holder KYC Status:</span>
                  <span
                    className={`px-3 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
                      selectedKyc.holderKycStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : selectedKyc.holderKycStatus === "unverified"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedKyc.holderKycStatus}
                  </span>
                </div>
                <div className="space-y-2 border-2 px-2 rounded-md border-green-500 py-1 pb-2 shadow-md">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document Type:</span>
                    <span className="font-medium">
                      {selectedKyc.documentType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document No:</span>
                    <span className="font-medium">
                      {selectedKyc.documentNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry Date:</span>
                    <span className="font-medium">
                      {selectedKyc.expiryDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
                        selectedKyc.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedKyc.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedKyc.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created At:</span>
                    <span className="font-medium">
                      {formatDate(selectedKyc.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium">
                      {formatDate(selectedKyc.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedKyc.documentFront && (
                <div className="bg-white border rounded-lg p-2 text-center">
                  <h5 className="font-medium mb-1">Front</h5>
                  <img
                    src={selectedKyc.documentFront}
                    alt="Front"
                    className="mx-auto max-h-40"
                  />
                </div>
              )}
              {selectedKyc.documentBack && (
                <div className="bg-white border rounded-lg p-2 text-center">
                  <h5 className="font-medium mb-1">Back</h5>
                  <img
                    src={selectedKyc.documentBack}
                    alt="Back"
                    className="mx-auto max-h-40"
                  />
                </div>
              )}
              {selectedKyc.selfie && (
                <div className="bg-white border rounded-lg p-2 text-center">
                  <h5 className="font-medium mb-1">Selfie</h5>
                  <img
                    src={selectedKyc.selfie}
                    alt="Selfie"
                    className="mx-auto max-h-40"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </ReusableModal>
    </div>
  );
};

export default KYCRequestList;
