import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AiOutlineCloudDownload } from "react-icons/ai";

const DownloadButtons = ({ data = [], columns, fileName = "table_data" }) => {
  // Auto-generate columns if not provided
  const finalColumns = columns?.length
    ? columns
    : data.length
    ? Object.keys(data[0]).map((key) => ({ field: key, headerName: key }))
    : [];

  const flattenValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      // Try to join object values with space
      return Object.values(value)
        .map((v) => (v !== null && v !== undefined ? v : ""))
        .join(" ");
    }
    return value;
  };

  const exportCSV = () => {
    if (!data.length) return;

    const finalColumns =
      columns?.length > 0
        ? columns
        : Object.keys(data[0]).map((key) => ({ field: key, headerName: key }));

    const header = finalColumns.map((col) => col.headerName).join(",");
    const rows = data.map((row) =>
      finalColumns.map((col) => `"${flattenValue(row[col.field])}"`).join(",")
    );

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "table_data.csv");
    link.click();
  };

  const flattenValuePdf = (value, field) => {
    if (value === null || value === undefined) return "";

    // Special handling for user object
    if (field === "user" && typeof value === "object") {
      return value.fullname || value.username || value.id || "";
    }

    if (typeof value === "object") {
      return Object.values(value)
        .map((v) => (v !== null && v !== undefined ? v : ""))
        .join(" ");
    }

    return value;
  };

  const exportPDF = () => {
    if (!data.length) return;

    const doc = new jsPDF("landscape");

    autoTable(doc, {
      head: [finalColumns.map((col) => col.headerName)],
      body: data.map((row) =>
        finalColumns.map((col) => flattenValuePdf(row[col.field], col.field))
      ),
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      headStyles: {
        fillColor: [33, 150, 243],
        halign: "center",
        valign: "middle",
      },
      columnStyles: finalColumns.reduce((acc, col, i) => {
        acc[i] = { cellWidth: "wrap" };
        return acc;
      }, {}),
      theme: "grid",
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex gap-2 mb-4 justify-end">
      <button
        onClick={exportCSV}
        className="px-2 bg-green-500 flex items-center gap-1 py-1 text-sm font-medium text-white rounded hover:bg-green-600"
      >
        CSV <AiOutlineCloudDownload />
      </button>
      <button
        onClick={exportPDF}
        className="px-2 bg-blue-500 flex items-center gap-1 py-1 text-sm font-medium text-white rounded hover:bg-blue-600"
      >
        PDF <AiOutlineCloudDownload />
      </button>
    </div>
  );
};

export default DownloadButtons;
