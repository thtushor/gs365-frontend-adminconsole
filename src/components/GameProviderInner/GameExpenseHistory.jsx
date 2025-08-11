import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useGetRequest } from "../../Utils/apiClient";
import { API_LIST, BASE_URL } from "../../api/ApiList";
import DataTable from "../DataTable";
import Pagination from "../Pagination";

const GameExpenseHistory = () => {
  const { gameProviderId } = useParams();
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
        url: `${BASE_URL}${API_LIST.AFFILIATE_LIST}/${gameProviderId}${API_LIST.GET_SUB_AFFILIATES}`,
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
      field: "payment_method",
      headerName: "Payment Method",
      width: 140,
      render: (_, row) => "bKash",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 180,
      render: (_, row) => 10000,
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      width: 120,
      render: (_, row) => "5LKJDF23434J",
    },
    {
      field: "accNumber",
      headerName: "Account Number",
      width: 180,
      render: (_, row) => "01838347363",
    },
    {
      field: "paymentReceipt",
      headerName: "Payment Receipt",
      width: 120,
      render: (_, row) => (
        <div className="bg-green-100 text-[14px] pb-[2px] cursor-pointer border border-green-500 text-green-500 px-3 rounded-full w-fit font-medium">
          View Receipt
        </div>
      ),
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
          ID-{gameProviderId}
        </span>{" "}
        Game Expense History
      </h1>
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Loading history...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load game expense history:{" "}
          {error?.message || "Unknown error"}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No game expense history found.
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

export default GameExpenseHistory;
