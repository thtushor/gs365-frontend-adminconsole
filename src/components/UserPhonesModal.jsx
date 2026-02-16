import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaTrash,
  FaPen,
  FaCheck,
  FaTimes,
  FaSync,
  FaPhone,
  FaShieldAlt,
  FaCommentDots,
} from "react-icons/fa";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const emptyPhone = {
  phoneNumber: "",
  isPrimary: false,
  isVerified: false,
  isSmsCapable: false,
};

const UserPhonesModal = ({ open, onClose, userId, userRole }) => {
  const queryClient = useQueryClient();
  const [newPhone, setNewPhone] = useState(emptyPhone);
  const [editingId, setEditingId] = useState(null);
  const [localRows, setLocalRows] = useState([]);
  const [filter, setFilter] = useState("");
  const [addError, setAddError] = useState("");
  const [rowErrors, setRowErrors] = useState({});

  const isAdmin = userRole === "admin" || userRole === "superAdmin";

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["userPhones", userId],
    queryFn: async () => {
      const url = API_LIST.GET_USER_PHONES_BY_USER.replace(":userId", userId);
      const res = await Axios.get(url);
      if (!res?.data?.status) throw new Error(res?.data?.message || "Failed");
      return res.data.data || [];
    },
    enabled: !!userId && open,
  });

  useEffect(() => {
    if (open) {
      setEditingId(null);
      setNewPhone(emptyPhone);
    }
  }, [open]);

  useEffect(() => {
    setLocalRows(Array.isArray(data) ? data : []);
  }, [data]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["userPhones", userId] });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await Axios.post(API_LIST.CREATE_USER_PHONE, payload);
      if (!res?.data?.status) throw new Error(res?.data?.message || "Failed");
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Phone added");
      setNewPhone(emptyPhone);
      invalidate();
    },
    onSettled: () => {
      invalidate();
    },
    onError: (e) => toast.error(e?.message || "Failed to add phone"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await Axios.post(`${API_LIST.UPDATE_USER_PHONE}/${id}`, payload);
      if (!res?.data?.status) throw new Error(res?.data?.message || "Failed");
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Phone updated");
      setEditingId(null);
      invalidate();
    },
    onSettled: () => {
      invalidate();
    },
    onError: (e) => toast.error(e?.message || "Failed to update phone"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await Axios.post(`${API_LIST.DELETE_USER_PHONE}/${id}`);
      if (!res?.data?.status) throw new Error(res?.data?.message || "Failed");
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Phone deleted");
      invalidate();
    },
    onSettled: () => {
      invalidate();
    },
    onError: (e) => toast.error(e?.message || "Failed to delete phone"),
  });

  const hasPrimary = useMemo(
    () => localRows?.some((r) => r?.isPrimary),
    [localRows]
  );

  const handleAdd = () => {
    if (!newPhone.phoneNumber?.trim()) {
      setAddError("Phone number is required");
      toast.error("Phone number is required");
      return;
    }
    if (!isValidPhoneNumber(newPhone.phoneNumber)) {
      setAddError("Enter a valid phone number");
      toast.error("Enter a valid phone number");
      return;
    }
    if (newPhone.isPrimary && hasPrimary) {
      toast.error("Primary phone already exists");
      return;
    }
    if (localRows.length >= 3) {
      toast.error("Maximum 3 phone numbers allowed");
      return;
    }
    createMutation.mutate({ userId, ...newPhone });
  };

  const handleStartEdit = (row) => {
    setEditingId(row.id);
    setLocalRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...row } : r))
    );
  };

  const handleCancelEdit = (id) => {
    setEditingId(null);
    // reset from server snapshot
    setLocalRows(Array.isArray(data) ? data : []);
  };

  const handleSaveEdit = (row) => {
    if (!row.phoneNumber?.trim()) {
      setRowErrors((prev) => ({ ...prev, [row.id]: "Phone number is required" }));
      toast.error("Phone number is required");
      return;
    }
    if (!isValidPhoneNumber(row.phoneNumber)) {
      setRowErrors((prev) => ({ ...prev, [row.id]: "Enter a valid phone number" }));
      toast.error("Enter a valid phone number");
      return;
    }
    if (row.isPrimary && hasPrimary && !data.find((r) => r.id === row.id)?.isPrimary) {
      toast.error("Primary phone already exists");
      return;
    }
    updateMutation.mutate({ id: row.id, ...row, userId });
  };

  const toggleLocalField = (id, field) => {
    setLocalRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, [field]: !r[field] }
          : field === "isPrimary" && !r.id
            ? { ...r, isPrimary: false }
            : r
      )
    );
  };

  const renderRow = (row) => {
    const isEditing = editingId === row.id;
    const isSaving = updateMutation.isPending && updateMutation.variables?.id === row.id;
    const isDeleting = deleteMutation.isPending && deleteMutation.variables === row.id;
    const cardAccent = row.isPrimary
      ? "ring-2 ring-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md"
      : "bg-white shadow-sm hover:shadow-md";

    return (
      <div
        key={row.id}
        className={`flex flex-col gap-3 p-3 sm:p-4 mb-3 border border-gray-200 rounded-xl transition-all duration-200 ${cardAccent} ${isSaving || isDeleting ? "opacity-75" : ""
          }`}
      >
        {/* ROW 1: Icon + Input + Checkboxes (when editing) OR Icon + Info */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <FaPhone className="text-xs sm:text-sm" />
            </div>
            {isEditing ? (
              <div className="flex-1 min-w-0">
                <div className="border-2 border-gray-200 rounded-lg px-3 py-2">
                  <PhoneInput
                    className="w-full text-sm sm:text-base flex-1"
                    international
                    defaultCountry="BD"
                    placeholder="Enter phone number"
                    value={row.phoneNumber || ""}
                    onChange={(value) =>
                      setLocalRows((prev) =>
                        prev.map((r) => (r.id === row.id ? { ...r, phoneNumber: value || "" } : r))
                      )
                    }
                    disabled={isSaving}
                  />
                </div>
                {rowErrors[row.id] && (
                  <div className="text-red-500 text-xs mt-1">{rowErrors[row.id]}</div>
                )}
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 font-bold text-base sm:text-lg tracking-wide mb-1 sm:mb-2 break-all">
                  {row.phoneNumber}
                </div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {row.isPrimary && (
                    <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 border border-green-300 inline-flex items-center gap-1 sm:gap-1.5 font-medium">
                      <FaCheck className="text-xs" />
                      <span className="hidden sm:inline">Primary</span>
                      <span className="sm:hidden">P</span>
                    </span>
                  )}
                  {row.isVerified && (
                    <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-300 inline-flex items-center gap-1 sm:gap-1.5 font-medium">
                      <FaShieldAlt className="text-xs" />
                      <span className="hidden sm:inline">Verified</span>
                      <span className="sm:hidden">V</span>
                    </span>
                  )}
                  {row.isSmsCapable && (
                    <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 border border-purple-300 inline-flex items-center gap-1 sm:gap-1.5 font-medium">
                      <FaCommentDots className="text-xs" />
                      <span className="hidden sm:inline">SMS Capable</span>
                      <span className="sm:hidden">SMS</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  checked={!!row.isPrimary}
                  onChange={() =>
                    setLocalRows((prev) =>
                      prev.map((r) => ({
                        ...r,
                        isPrimary: r.id === row.id ? !r.isPrimary : false,
                      }))
                    )
                  }
                  disabled={isSaving}
                />
                Primary
              </label>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={!!row.isVerified}
                  onChange={() => toggleLocalField(row.id, "isVerified")}
                  disabled={isSaving}
                />
                Verified
              </label>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={!!row.isSmsCapable}
                  onChange={() => toggleLocalField(row.id, "isSmsCapable")}
                  disabled={isSaving}
                />
                SMS
              </label>
            </div>
          )}
        </div>

        {/* ROW 2: Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          {isEditing ? (
            <>
              <button
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all ${isSaving
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                  }`}
                onClick={() => handleSaveEdit(row)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSync className="animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span className="hidden sm:inline">Save</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </button>
              <button
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 inline-flex items-center justify-center gap-2 transition-all"
                onClick={() => handleCancelEdit(row.id)}
                disabled={isSaving}
              >
                <FaTimes />
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            </>
          ) : isAdmin ? (
            <>
              <button
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                onClick={() => handleStartEdit(row)}
                disabled={isDeleting}
              >
                <FaPen />
                <span className="hidden sm:inline">Edit</span>
                <span className="sm:hidden">Edit</span>
              </button>
              <button
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-all ${isDeleting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                  }`}
                onClick={() => {
                  if (window.confirm("Delete this phone number?")) {
                    deleteMutation.mutate(row.id);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <FaSync className="animate-spin" />
                    <span className="hidden sm:inline">Deleting...</span>
                    <span className="sm:hidden">Delete</span>
                  </>
                ) : (
                  <>
                    <FaTrash />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Delete</span>
                  </>
                )}
              </button>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      className={"min-w-[60vw]"}
      title={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-semibold text-base sm:text-lg">Manage Phone Numbers</span>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              className="px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              className={`text-xs px-3 py-1.5 rounded border inline-flex items-center justify-center gap-2 ${isFetching ? "bg-gray-100 text-gray-500" : "hover:bg-gray-100"
                }`}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <FaSync className={isFetching ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">↻</span>
            </button>
          </div>
        </div>
      }
      onSave={null}
    // className="max-w-3xl"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-6">
            Failed to load phones.
            <div className="mt-3">
              <button
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => refetch()}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="px-1">
              {(localRows || [])
                .filter((r) =>
                  filter
                    ? String(r.phoneNumber || "")
                      .toLowerCase()
                      .includes(filter.toLowerCase())
                    : true
                )
                .map((row) => renderRow(row))}
              {(!localRows || localRows.length === 0) && (
                <div className="text-center text-gray-400 py-6">No phones yet</div>
              )}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-green-100">
            <div className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2 text-emerald-900">
              <FaPhone /> Add New Phone
              <span className="text-xs font-normal text-gray-500 ml-auto">
                {localRows.length}/3
              </span>
            </div>
            {localRows.length >= 3 ? (
              <div className="text-center text-amber-600 py-3 text-sm font-medium">
                Maximum 3 phone numbers reached.
              </div>
            ) : (
              <>
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 items-start lg:items-center">
                  <div className="w-full lg:col-span-6">
                    <div className="border-2 border-gray-200 rounded-lg px-3 py-2">
                      <PhoneInput
                        className="w-full text-sm sm:text-base"
                        international
                        defaultCountry="BD"
                        placeholder="Enter phone number"
                        value={newPhone.phoneNumber}
                        onChange={(value) => {
                          setNewPhone((p) => ({ ...p, phoneNumber: value || "" }));
                          setAddError("");
                        }}
                      />
                    </div>
                    {addError && <div className="text-red-500 text-xs mt-1">{addError}</div>}
                  </div>
                  <div className="flex flex-col sm:flex-row lg:col-span-6 gap-3 lg:gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        checked={newPhone.isPrimary}
                        onChange={() =>
                          setNewPhone((p) => ({ ...p, isPrimary: !p.isPrimary }))
                        }
                        disabled={hasPrimary}
                      />
                      Primary
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={newPhone.isVerified}
                        onChange={() =>
                          setNewPhone((p) => ({ ...p, isVerified: !p.isVerified }))
                        }
                      />
                      Verified
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        checked={newPhone.isSmsCapable}
                        onChange={() =>
                          setNewPhone((p) => ({ ...p, isSmsCapable: !p.isSmsCapable }))
                        }
                      />
                      SMS
                    </label>
                  </div>
                </div>
                <div className="mt-3 flex justify-center sm:justify-end">
                  <button
                    className={`px-4 py-2 rounded text-white inline-flex items-center gap-2 w-full sm:w-auto justify-center ${createMutation.isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow"
                      }`}
                    onClick={handleAdd}
                    disabled={createMutation.isPending}
                  >
                    <FaPlus /> Add Phone
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ReusableModal>
  );
};

export default UserPhonesModal;


