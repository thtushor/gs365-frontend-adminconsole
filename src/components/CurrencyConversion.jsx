import { useState } from "react";
import CurrencyRate from "./CurrencyRate";
import { useCurrencies } from "./shared/useCurrencies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useGetRequest } from "../Utils/apiClient";
import DataTable from "./DataTable";
import { FaRegEdit } from "react-icons/fa";
import BaseModal from "./shared/BaseModal";
import DeleteConfirmationPopup from "./inner_component/DeleteConfirmationPopup";
import { MdDeleteOutline } from "react-icons/md";

const CurrencyConversion = () => {
  const { data: currencyList, isLoading: currencyLoading } = useCurrencies();
  const currencyOptions =
    currencyList?.map((currency) => ({
      value: currency.id,
      label: `${currency.name} (${currency.code})`,
    })) || [];

  const [currencyEdit, setCurrencyEdit] = useState(null);
  const [conversionDelete, setConversionDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getRequest = useGetRequest();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["currency-conversion"],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.CURRENCY_LIST,
        errorMessage: "Failed to fetch currency conversion list",
      }),
    keepPreviousData: true,
  });

  const conversion = data?.data || [];

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      field: "fromName",
      headerName: "From Currency",
      width: 200,
    },
    {
      field: "toName",
      headerName: "To Currency",
      width: 200,
    },
    {
      field: "rate",
      headerName: "Conversion Rate",
      width: 200,
      render: (_, row) => {
        const rate = Number(row?.rate);
        return (
          <span className="font-medium text-blue-500">
            {`1 ${row?.fromCode} = ${!isNaN(rate) ? rate.toFixed(2) : "0.00"} ${
              row?.toCode
            }`}
          </span>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
    {
      field: "updatedAt",
      headerName: "Last Update",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      align: "center",
      render: (_, row) => (
        <div className="flex items-center">
          <button
            onClick={() => setCurrencyEdit(row)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer w-full flex items-center justify-center"
          >
            <FaRegEdit size={18} />
          </button>
          <button
            onClick={() => {
              setConversionDelete(row);
              setIsModalOpen(true);
            }}
            className="text-red-600 hover:text-red-800 cursor-pointer text-[20px]"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CurrencyRate
        currencyLoading={currencyLoading}
        currencyOptions={currencyOptions}
        editData={currencyEdit}
        onSuccess={() => {
          refetch();
          setCurrencyEdit(null);
        }}
        onCancel={() => setCurrencyEdit(null)}
      />

      <div className="mt-5 pt-3 border bg-white border-gray-300 p-5 rounded-lg">
        <h2 className="text-[20px] font-semibold text-left">Conversion Rate</h2>

        {isLoading ? (
          <div className="text-center text-gray-500">
            Loading conversion rate...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Failed to load events: {error?.message || "Unknown error"}
          </div>
        ) : conversion.length === 0 ? (
          <div className="text-center text-gray-500">
            No conversion rate found.
          </div>
        ) : (
          <DataTable columns={columns} data={conversion} />
        )}
      </div>

      <BaseModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {conversionDelete && (
          <DeleteConfirmationPopup
            apiUrl={`${BASE_URL}${API_LIST.DELETE_CONVERSION}/${conversionDelete.id}`}
            payload={{}} // optional
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ["currency-conversion"],
              });
              setIsModalOpen(false);
              setConversionDelete(null);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setConversionDelete(null);
            }}
            message={`Are you sure you want to delete this conversion?`}
          />
        )}
      </BaseModal>
    </div>
  );
};

export default CurrencyConversion;
