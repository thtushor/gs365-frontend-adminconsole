import React, { useState } from "react";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { Link, useParams } from "react-router-dom";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { useAuth } from "../hooks/useAuth";

const SubAffiliatesList = () => {
  const { affiliateInfo } = useAuth();
  const { affiliateId } = useParams();
  const getRequest = useGetRequest();
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    title: "",
    status: "",
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sub-affiliates", filters],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL}${API_LIST.AFFILIATE_LIST}/${affiliateId}${API_LIST.GET_SUB_AFFILIATES}`,
        params: filters,
        errorMessage: "Failed to fetch sub-affiliates list",
      }),
    keepPreviousData: true,
  });

  console.log("sub affiliate", data);

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) =>
        (filters.page - 1) * filters.pageSize + index + 1,
    },
    {
      field: "username",
      headerName: "Username",
      width: 140,
      render: (_, row) => (
        <Link
          to={`/affiliate-list/${row?.id}`}
          className="text-green-500 cursor-pointer font-semibold"
        >
          {row.username}
        </Link>
      ),
    },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 180,
      render: (_, row) => row.fullname,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 120,
      render: (_, row) => row.phone,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      render: (_, row) => row.email,
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      render: (_, row) => row.role,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      render: (value) => (
        <span
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
            value === "active" ? "text-green-600" : "text-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
      render: (_, row) => row.city,
    },
    {
      field: "isLoggedIn",
      headerName: "Is Logged In",
      width: 100,
      render: (_, row) => (row.isLoggedIn ? "Yes" : "No"),
    },
    {
      field: "isVerified",
      headerName: "Is Verified",
      width: 100,
      render: (_, row) => (row.isVerified ? "Yes" : "No"),
    },
    {
      field: "refCode",
      headerName: "Referral Code",
      width: 120,
      render: (_, row) => row.refCode,
    },
    {
      field: "lastIp",
      headerName: "Last IP",
      width: 120,
      render: (_, row) => row.lastIp,
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      width: 160,
      render: (_, row) =>
        row.lastLogin ? new Date(row.lastLogin).toLocaleString() : "",
    },
    {
      field: "device_type",
      headerName: "Device Type",
      width: 120,
      render: (_, row) => row.device_type,
    },
    {
      field: "device_name",
      headerName: "Device Name",
      width: 120,
      render: (_, row) => row.device_name,
    },
    {
      field: "os_version",
      headerName: "OS Version",
      width: 120,
      render: (_, row) => row.os_version,
    },
    {
      field: "browser",
      headerName: "Browser",
      width: 120,
      render: (_, row) => row.browser,
    },
    {
      field: "browser_version",
      headerName: "Browser Version",
      width: 120,
      render: (_, row) => row.browser_version,
    },
    {
      field: "ip_address",
      headerName: "IP Address",
      width: 120,
      render: (_, row) => row.ip_address,
    },
    {
      field: "total_sub_affiliates",
      headerName: "Total Sub",
      width: 120,
      render: (_, row) => row.total_sub_affiliates || 0,
    },
    {
      field: "total_balance",
      headerName: "Total Balance",
      width: 120,
      render: (_, row) => row.total_balance || 0,
    },
    {
      field: "total_withdraw",
      headerName: "Total Withdraw",
      width: 120,
      render: (_, row) => row.total_withdraw || 0,
    },
    {
      field: "commission_percentage",
      headerName: "Total Com. %",
      width: 120,

      render: (_, row) => row.commission_percent || 0,
    },
  ];

  const agents = data?.data || [];
  const total = data?.pagination?.totalPages || 0;
  const pageSize = filters.pageSize;
  const currentPage = filters.page;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }));
  };

  console.log(affiliateInfo?.role);
  return (
    <div className="bg-white p-4 rounded-md ">
      <div className="flex items-center justify-between w-full">
        <h1 className="mt-[-5px] text-base font-semibold bg-[#07122b] items-center gap-2 flex text-white px-[9px] w-fit rounded-md py-2  mb-4 text-[16px]">
          <span className="text-white px-[6px] bg-green-500 rounded-sm block">
            ID-{affiliateId}
          </span>{" "}
          Sub Affiliates List
        </h1>
        <Link
          to={`/create-affiliate?refCode=${affiliateInfo?.refCode}`}
          className="mt-[-5px] text-base font-semibold bg-green-500 hover:bg-green-600 items-center gap-2 flex text-white px-[9px] w-fit rounded-md py-2  mb-4 text-[16px]"
        >
          + Sub Affiliate
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Loading agents...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load agents: {error?.message || "Unknown error"}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No affiliates found.
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={data?.data} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
};

export default SubAffiliatesList;
