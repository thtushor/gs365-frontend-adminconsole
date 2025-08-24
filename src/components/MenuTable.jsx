import React from "react";

const MenuTable = ({
  columns,
  isLoading,
  data = [],
  onRowClick,
  selectedRow,
  selectable = false,
}) => {
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
      <div className="w-full">
        <table className="w-full table-auto text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {columns.map((column, index) => (
                <th
                  key={column.field || index}
                  className={`px-4 py-2  font-semibold whitespace-nowrap ${
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
    </div>
  );
};

export default MenuTable;
