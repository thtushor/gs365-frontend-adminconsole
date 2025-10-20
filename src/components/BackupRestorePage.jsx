import React, { useState } from "react";
import ReportCard from "./ReportCard";
import ReusableModal from "./ReusableModal";
import DataTable from "./DataTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";

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


const autoBackupStatus = "Enabled (Daily 03:00 UTC)";

const BackupRestorePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "restore" or "delete"
  const [selectedBackup, setSelectedBackup] = useState(null);

  const queryClient = useQueryClient();


  const backupMutation = useMutation({
    // queryKey: ["databaseBackups"],
    mutationFn: async () => {
      // Fetch backup files from backend API
      const response = await Axios.post(API_LIST.DATABASE_BACKUP);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databaseBackups"] });
    }
  })


  const dropTablesMutation = useMutation({
    // queryKey: ["databaseBackups"],
    mutationFn: async () => {
      // Fetch backup files from backend API
      const response = await Axios.post(API_LIST.DATABASE_DELETE_TABLES);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databaseBackups"] });
    }
  })

  const restoreFile = useMutation({
    // queryKey: ["databaseBackups"],
    mutationFn: async (data) => {
      // Fetch backup files from backend API
      const response = await Axios.post(API_LIST.DATABASE_RESTORE, {
        filename: data.filename
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databaseBackups"] });
    }
  })

  const deleteFile = useMutation({
    // queryKey: ["databaseBackups"],
    mutationFn: async (data) => {
      // Fetch backup files from backend API
      const response = await Axios.post(API_LIST.DATABASE_DELETE_FILES, {
        filename: data.filename
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databaseBackups"] });
    }
  })

  const downloadFile = useMutation({
    mutationFn: async ({ filename }) => {
      const response = await Axios.post(API_LIST.DATABASE_DOWNLOAD_BACKUP_FILES, { filename }, {
        responseType: "blob", // 👈 Important: Expect binary data
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // suggest the filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["databaseBackups"] });
    },
  })

  const { data: backupFiles } = useQuery({
    queryKey: ["databaseBackups"],
    queryFn: async () => {
      // Fetch backup files from backend API
      const response = await Axios.post(API_LIST.DATABASE_BACKUP_FILES);
      return response.data;
    }
  })

  // console.log("Backup Files:", backupFiles);

  const columns = [
    { field: "file", headerName: "Backup Name", width: 200 },
    { field: "date", headerName: "Date/Time", width: 160, render: (value) => new Date(value).toLocaleString() },
    { field: "size", headerName: "Size", width: 80 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      render: () => (
        <span
          className={"text-green-600"}
        >
          Success
        </span>
      ),
    },
    // { field: "location", headerName: "Location", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 220,
      align: "center",
      render: (value, row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 disabled:bg-blue-400 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            onClick={() => {
              alert(`Download ${row.file}`)
              downloadFile.mutate({ filename: row.file });
            }}
            disabled={downloadFile?.isPending}
          >
            {
              downloadFile?.isPending ? "Downloading..." : "Download"
            }
          </button>
          <button
            className="px-2 py-1 disabled:bg-green-300 disabled:text-black bg-green-500 text-white rounded hover:bg-green-600 text-xs"
            onClick={() => {
              setSelectedBackup(row);
              setModalType("restore");
              setModalOpen(true);
            }}
            disabled={restoreFile?.isPending}
          >
            {restoreFile?.isPending ? "Restoring..." : "Restore"}
          </button>
          <button
            className="px-2 py-1 disabled:bg-red-400 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
            onClick={() => {
              setSelectedBackup(row);
              setModalType("delete");
              setModalOpen(true);
            }}
            disabled={deleteFile?.isPending}
          >
            {deleteFile?.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  function handleManualBackup() {
    backupMutation.mutate();
    // alert("Manual backup started!");
    // Here you would trigger the backend backup process
  }

  function handleModalConfirm() {
    if (modalType === "restore") {
      // alert(`Restoring from backup: ${selectedBackup.file}`);

      restoreFile.mutate({ filename: selectedBackup.file });
      // Trigger restore logic here
    } else if (modalType === "delete") {
      // alert(`Deleting backup: ${selectedBackup.file}`);
      deleteFile.mutate({ filename: selectedBackup.file });
      // Trigger delete logic here
    }
    else if (modalType === "dropTables") {
      // alert(`Dropping all tables`);
      dropTablesMutation.mutate();
      // Trigger delete logic here
    }
    setModalOpen(false);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Backup & Restore</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <ReportCard title="Last Backup" value={new Date(backupFiles?.[0]?.date).toLocaleString()} />
        <ReportCard title="Total Backups" value={backupFiles?.length||0} />
        <ReportCard title="Storage Location" value={"GS Server"} />
        <ReportCard
          title="Auto-Backup"
          value={autoBackupStatus}
          highlight="text-green-600"
        />
      </div>
      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          className="bg-green-500 disabled:bg-green-400 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleManualBackup}
          disabled={backupMutation?.isPending}
        >
          {backupMutation?.isPending ? "Backuping..." : "Manual Backup"}
        </button>
         <button
          className="bg-red-500 disabled:bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={()=>{
            setModalType("dropTables");
            setModalOpen(true);
          }}
          disabled={dropTablesMutation?.isPending}
        >
          {dropTablesMutation?.isPending ? "Droping..." : "Drop All Tables"}
        </button>
      </div>
      {/* Backup History Table */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Backup History</h3>
        <DataTable columns={columns} data={backupFiles} />
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
          {modalType === "dropTables" && (
            <>
              <p>
                Are you sure you want to <b>drop</b> all the tables?{" "}
                {/* <b>{selectedBackup?.name}</b>? */}
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
