import React, { useState } from "react";
import { useGetRequest } from "../Utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { Link, useParams } from "react-router-dom";
import DataTable from "./DataTable";
import Pagination from "./Pagination";

const AffiliatePlayerComHistory = () => {
  const { affiliateId } = useParams();
  const getRequest = useGetRequest();
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
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
      field: "created_at",
      headerName: "Date & Time",
      width: 140,
      render: (_, row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "N/A",
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
      field: "commission_percent",
      headerName: "Commission %",
      width: 120,
      render: (_, row) => row.commission_percent || 0,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      align: "center",
      render: (_, row) => row.amount || 0,
    },
    {
      field: "country_currency",
      headerName: "Country/Currency",
      width: 120,
      render: (_, row) => row.country_currency || "N/A",
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
  return (
    <div className="bg-white p-4 rounded-md ">
      <h1 className="mt-[-5px] text-base font-semibold bg-[#07122b] items-center gap-2 flex text-white px-[9px] w-fit rounded-md py-2  mb-4 text-[16px]">
        <span className="text-white px-[6px] bg-green-500 rounded-sm block">
          ID-{affiliateId}
        </span>{" "}
        Player Commission History
      </h1>
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Loading players...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load agents: {error?.message || "Unknown error"}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No players commission history found.
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

export default AffiliatePlayerComHistory;
