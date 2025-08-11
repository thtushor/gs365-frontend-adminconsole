import React, { useState } from "react";
import ReportCard from "./ReportCard";
import ReusableModal from "./ReusableModal";
import DataTable from "./DataTable";

const mockBackups = [
  {
    name: "backup-2024-06-28-01-00",
    date: "2024-06-28 01:00",
    size: "120MB",
    status: "Success",
    location: "AWS S3",
  },
  {
    name: "backup-2024-06-27-01-00",
    date: "2024-06-27 01:00",
    size: "119MB",
    status: "Success",
    location: "AWS S3",
  },
  {
    name: "backup-2024-06-26-01-00",
    date: "2024-06-26 01:00",
    size: "118MB",
    status: "Success",
    location: "AWS S3",
  },
];

const lastBackup = mockBackups[0];
const totalBackups = mockBackups.length;
const backupLocation = lastBackup.location;
const autoBackupStatus = "Enabled (Daily 01:00 UTC)";

const BackupRestorePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "restore" or "delete"
  const [selectedBackup, setSelectedBackup] = useState(null);

  const columns = [
    { field: "name", headerName: "Backup Name", width: 200 },
    { field: "date", headerName: "Date/Time", width: 160 },
    { field: "size", headerName: "Size", width: 80 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: (value) => (
        <span
          className={value === "Success" ? "text-green-600" : "text-red-600"}
        >
          {value}
        </span>
      ),
    },
    { field: "location", headerName: "Location", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      align: "center",
      render: (value, row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            onClick={() => alert(`Download ${row.name}`)}
          >
            Download
          </button>
          <button
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
            onClick={() => {
              setSelectedBackup(row);
              setModalType("restore");
              setModalOpen(true);
            }}
          >
            Restore
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
            onClick={() => {
              setSelectedBackup(row);
              setModalType("delete");
              setModalOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  function handleManualBackup() {
    alert("Manual backup started!");
    // Here you would trigger the backend backup process
  }

  function handleModalConfirm() {
    if (modalType === "restore") {
      alert(`Restoring from backup: ${selectedBackup.name}`);
      // Trigger restore logic here
    } else if (modalType === "delete") {
      alert(`Deleting backup: ${selectedBackup.name}`);
      // Trigger delete logic here
    }
    setModalOpen(false);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Backup & Restore</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <ReportCard title="Last Backup" value={lastBackup.date} />
        <ReportCard title="Total Backups" value={totalBackups} />
        <ReportCard title="Storage Location" value={backupLocation} />
        <ReportCard
          title="Auto-Backup"
          value={autoBackupStatus}
          highlight="text-green-600"
        />
      </div>
      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleManualBackup}
        >
          Manual Backup
        </button>
      </div>
      {/* Backup History Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Backup History</h3>
        <DataTable columns={columns} data={mockBackups} />
      </div>
      {/* Restore/Delete Modal */}
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "restore" ? "Restore Backup" : "Delete Backup"}
        onSave={handleModalConfirm}
      >
        <div>
          {modalType === "restore" && (
            <>
              <p>
                Are you sure you want to <b>restore</b> from backup{" "}
                <b>{selectedBackup?.name}</b>?
              </p>
              <p className="text-xs text-red-500 mt-2">
                This will overwrite all current data. Please ensure you have
                downloaded the latest backup.
              </p>
            </>
          )}
          {modalType === "delete" && (
            <>
              <p>
                Are you sure you want to <b>delete</b> backup{" "}
                <b>{selectedBackup?.name}</b>?
              </p>
              <p className="text-xs text-red-500 mt-2">
                This action cannot be undone.
              </p>
            </>
          )}
        </div>
      </ReusableModal>
    </div>
  );
};

export default BackupRestorePage;
