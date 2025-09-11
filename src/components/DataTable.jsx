import React from "react";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { hasPermission } from "../Utils/permissions";

const DataTable = ({
  columns,
  isLoading,
  isSuperAdmin,
  permissions,
  exportPermission,
  data = [],
  onRowClick,
  selectedRow,
  selectable = false,
}) => {
  // CSV Export
  const exportCSV = () => {
    if (!data.length) return;
    const header = columns.map((col) => col.headerName).join(",");
    const rows = data.map((row) =>
      columns.map((col) => `"${row[col.field] ?? ""}"`).join(",")
    );
    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "table_data.csv");
    link.click();
  };

  // PDF Export
  const exportPDF = () => {
    if (!data.length) return;

    const doc = new jsPDF("landscape");

    autoTable(doc, {
      head: [columns.map((col) => col.headerName)],
      body: data.map((row) => columns.map((col) => row[col.field] ?? "")),
      styles: {
        fontSize: 8, // smaller font to fit columns
        cellPadding: 3,
        overflow: "linebreak", // wrap long text
      },
      headStyles: {
        fillColor: [33, 150, 243], // header blue
        halign: "center",
        valign: "middle",
      },
      columnStyles: columns.reduce((acc, col, i) => {
        acc[i] = { cellWidth: "wrap" }; // auto-wrap each column
        return acc;
      }, {}),
      theme: "grid",
    });

    doc.save("table_data.pdf");
  };

  if (!Array.isArray(data)) {
    return (
      <p className="text-red-300 text-center">Table Data format is not valid</p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Export Buttons */}
      {(isSuperAdmin || (exportPermission && hasPermission(permissions, exportPermission))) && (
        <div className="flex justify-end mb-2 gap-2">
          <button
            onClick={exportCSV}
            className="px-2 bg-green-500 flex cursor-pointer hover:bg-green-600 items-center gap-[2px] py-[3px] text-[14px] font-medium text-white rounded"
          >
            CSV
            <span className="text-[18px]">
              <AiOutlineCloudDownload />
            </span>
          </button>
          <button
            onClick={exportPDF}
            className="px-2 bg-blue-500 py-[3px] cursor-pointer hover:bg-blue-600 flex items-center gap-[2px] text-[14px] font-medium text-white rounded"
          >
            PDF
            <span className="text-[18px]">
              <AiOutlineCloudDownload />
            </span>
          </button>
        </div>
      )}

      {/* Table */}
      <table className="w-full table-auto text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {columns.map((column, index) => (
              <th
                key={column.field || index}
                className={`px-4 py-2 font-semibold whitespace-nowrap ${
                  column.width ? `w-[${column.width}px]` : ""
                } ${column.align === "center" ? "text-center" : "text-left"}`}
              >
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`border-b border-gray-200 whitespace-nowrap hover:bg-gray-50 cursor-pointer ${
                selectable && selectedRow && selectedRow.id === row.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
              onClick={() => selectable && onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${row.id || rowIndex}-${column.field || colIndex}`}
                  className={`px-4 py-2 ${
                    column.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  <div>
                    {column.field === "sl"
                      ? rowIndex + 1
                      : column.render
                      ? column.render(row[column.field], row)
                      : row[column.field]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
