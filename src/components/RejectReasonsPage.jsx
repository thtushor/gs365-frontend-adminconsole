import React, { useState, useMemo } from "react";
import { useRejectReasons } from "../hooks/useRejectReasons";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import { useAuth } from "../hooks/useAuth";
import { hasPermission } from "../Utils/permissions";

const RejectReasonsPage = () => {
    const {
        getRejectReasons,
        createRejectReason,
        updateRejectReason,
        deleteRejectReason,
    } = useRejectReasons();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);
    const [formData, setFormData] = useState({ reason: "", description: "" });

    const { user } = useAuth();
    const isSuperAdmin = user?.role === "superAdmin";
    const permissions = user?.designation?.permissions || [];
    const canManage =
        isSuperAdmin || hasPermission(permissions, "settings_manage_reject_reasons");

    const columns = useMemo(
        () => [
            { headerName: "SL", field: "sl", width: 50, align: "center" },
            { headerName: "ID", field: "id", width: 80, align: "center" },
            { headerName: "Reason", field: "reason", width: 200 },
            { headerName: "Description", field: "description", width: 300 },
            {
                headerName: "Actions",
                width: 150,
                align: "center",
                render: (value, row) => (
                    <div className="flex gap-2 justify-center">
                        {canManage && (
                            <>
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                                    onClick={() => handleEdit(row)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                                    onClick={() => handleDelete(row.id)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [canManage],
    );

    const handleEdit = (row) => {
        setSelectedReason(row);
        setFormData({ reason: row.reason, description: row.description || "" });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this reject reason?")) {
            await deleteRejectReason.mutateAsync(id);
        }
    };

    const handleSave = async () => {
        try {
            if (selectedReason) {
                await updateRejectReason.mutateAsync({
                    id: selectedReason.id,
                    ...formData,
                });
            } else {
                await createRejectReason.mutateAsync(formData);
            }
            setModalOpen(false);
            setFormData({ reason: "", description: "" });
            setSelectedReason(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Reject Reasons Management</h2>
                {canManage && (
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => {
                            setSelectedReason(null);
                            setFormData({ reason: "", description: "" });
                            setModalOpen(true);
                        }}
                    >
                        Add Reason
                    </button>
                )}
            </div>

            <div className="bg-white rounded shadow p-4">
                <DataTable
                    columns={columns}
                    data={getRejectReasons?.data?.data || []}
                    isLoading={getRejectReasons.isLoading}
                />
            </div>

            <ReusableModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedReason ? "Edit Reject Reason" : "Add Reject Reason"}
                onSave={handleSave}
                isLoading={createRejectReason.isPending || updateRejectReason.isPending}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Reason
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-200 outline-none"
                            value={formData.reason}
                            onChange={(e) =>
                                setFormData({ ...formData, reason: e.target.value })
                            }
                            placeholder="e.g., Invalid Documents"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-200 outline-none"
                            rows={3}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Optional description"
                        />
                    </div>
                </div>
            </ReusableModal>
        </div>
    );
};

export default RejectReasonsPage;
