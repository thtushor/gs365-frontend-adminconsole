import React, { useState } from "react";

const ExpandableDataTable = ({ columns, data = [], subTableConfig }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  if (!Array.isArray(data)) {
    return (
      <p className="text-red-300 text-center">Table Data format is not valid</p>
    );
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  console.log(data);
  return (
    <div className="w-full overflow-x-auto font-medium">
      <div className="w-full">
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
            {data.map((row, rowIndex) => {
              const id = row.id || row.dropdown_id || rowIndex;

              const isExpandable =
                subTableConfig &&
                (typeof subTableConfig.expandableCheck === "function"
                  ? subTableConfig.expandableCheck(row)
                  : Array.isArray(row[subTableConfig?.field]) &&
                    row[subTableConfig?.field]?.length > 0);

              return (
                <React.Fragment key={id}>
                  {/* Main Row */}
                  <tr
                    onClick={() =>
                      isExpandable && row?.options?.length > 0 && toggleRow(id)
                    }
                    className={`border-b border-green-300 ${
                      row?.options?.length > 0
                        ? " cursor-pointer hover:bg-green-200 bg-green-100"
                        : "bg-gray-100 cursor-default "
                    }  whitespace-nowrap`}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={`${id}-${column.field || colIndex}`}
                        className={`px-4 py-2 ${
                          column.align === "center"
                            ? "text-center"
                            : "text-left"
                        }`}
                      >
                        {column.render
                          ? column.render(row[column.field], row)
                          : row[column.field]}
                      </td>
                    ))}
                  </tr>

                  {/* Sub Table */}
                  {isExpandable && expandedRows.includes(id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={columns.length}>
                        <table className="text-sm w-full border border-gray-200 rounded overflow-hidden border-collapse">
                          <thead>
                            <tr className="text-gray-600 bg-gray-100 border-b border-gray-200">
                              {(row.name?.toLowerCase() === "categories"
                                ? subTableConfig.columns
                                : subTableConfig.columns.filter(
                                    (col) => col.field !== "isMenu"
                                  )
                              ).map((col, i) => (
                                <th
                                  key={i}
                                  className={`px-2 py-1 border border-gray-200 ${
                                    col.align === "center"
                                      ? "text-center"
                                      : "text-left"
                                  }`}
                                >
                                  {col.headerName}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {row[subTableConfig.field].map((subRow, idx) => (
                              <tr
                                key={subRow.id || idx}
                                className="border-t border-gray-200 hover:bg-gray-50"
                              >
                                {(row.name?.toLowerCase() === "categories"
                                  ? subTableConfig.columns
                                  : subTableConfig.columns.filter(
                                      (col) => col.field !== "isMenu"
                                    )
                                ).map((col, j) => (
                                  <td
                                    key={j}
                                    className={`px-2 py-1 border border-gray-200 ${
                                      col.align === "center"
                                        ? "text-center"
                                        : "text-left"
                                    }`}
                                  >
                                    {col.render
                                      ? col.render(
                                          subRow[col.field],
                                          subRow,
                                          idx,
                                          row
                                        )
                                      : subRow[col.field]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandableDataTable;
