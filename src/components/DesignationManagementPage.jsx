import React, { useState } from "react";
import {
  useDesignations,
  useCreateDesignation,
  useUpdateDesignation,
  useDeleteDesignation,
} from "../hooks/useDesignations";
import { PERMISSION_CATEGORIES, ADMIN_USER_TYPES } from "../Utils/permissions";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaShieldAlt,
} from "react-icons/fa";
import { BiLoader, BiCheck, BiX } from "react-icons/bi";
import { MdOutlineAdminPanelSettings, MdOutlineSecurity } from "react-icons/md";
import DataTable from "./DataTable";
import ReusableModal from "./ReusableModal";
import DeleteConfirmationModal from "./shared/DeleteConfirmationModal";
import StatusChip from "./shared/StatusChip";
import LoadingState from "./shared/LoadingState";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";

const DesignationManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // React Query hooks
  const {
    data: designationsData,
    isLoading,
    error,
    refetch,
  } = useDesignations();
  const createMutation = useCreateDesignation();
  const updateMutation = useUpdateDesignation();
  const deleteMutation = useDeleteDesignation();

  const designations = designationsData?.data || [];

  // Filter designations based on search and type
  const filteredDesignations = designations.filter((designation) => {
    const matchesSearch = designation.designationName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || designation.adminUserType === filterType;
    return matchesSearch && matchesType;
  });

  // Handle form submission (both create and update)
  const handleFormSubmit = (formData) => {
    if (modalMode === "create") {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedDesignation(null);
        },
      });
    } else {
      updateMutation.mutate(
        {
          id: selectedDesignation.id,
          ...formData,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedDesignation(null);
          },
        }
      );
    }
  };

  // Handle delete designation
  const handleDelete = () => {
    deleteMutation.mutate(selectedDesignation.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedDesignation(null);
      },
    });
  };

  // Handle view designation
  const handleView = (designation) => {
    setSelectedDesignation(designation);
    setIsViewModalOpen(true);
  };

  // Handle edit designation
  const handleEdit = (designation) => {
    setSelectedDesignation(designation);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Handle create designation
  const handleCreate = () => {
    setSelectedDesignation(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (designation) => {
    setSelectedDesignation(designation);
    setIsDeleteModalOpen(true);
  };

  // Table columns configuration
  const columns = [
    {
      key: "designationName",
      label: "Designation Name",
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MdOutlineAdminPanelSettings className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "adminUserType",
      label: "User Type",
      render: (value) => {
        const typeConfig = ADMIN_USER_TYPES.find(
          (type) => type.value === value
        );
        return (
          <StatusChip
            status={value}
            label={typeConfig?.label || value}
            className={typeConfig?.color || "bg-gray-100 text-gray-800"}
          />
        );
      },
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (value) => (
        <div className="flex items-center space-x-2">
          <FaShieldAlt className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            {value?.length || 0} permissions
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Designation"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Designation"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState message="Loading designations..." />;
  }

  if (error) {
    return (
      <ErrorState message="Failed to load designations" onRetry={refetch} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Designation Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user designations and their permissions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Create Designation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search designations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {ADMIN_USER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {filteredDesignations.length === 0 ? (
        <EmptyState
          message="No designations found"
          description="Create your first designation to get started"
          actionText="Create Designation"
          onAction={handleCreate}
        />
      ) : (
        <DataTable
          data={filteredDesignations}
          columns={columns}
          searchable={false} // We handle search in the component
        />
      )}

      {/* Unified Create/Edit Modal */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDesignation(null);
        }}
        title={
          modalMode === "create" ? "Create New Designation" : "Edit Designation"
        }
        size="lg"
      >
        <DesignationForm
          initialData={selectedDesignation}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedDesignation(null);
          }}
          isLoading={
            modalMode === "create"
              ? createMutation.isPending
              : updateMutation.isPending
          }
          mode={modalMode}
        />
      </ReusableModal>

      {/* View Modal */}
      <ReusableModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDesignation(null);
        }}
        title="Designation Details"
        size="lg"
      >
        <DesignationView designation={selectedDesignation} />
      </ReusableModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDesignation(null);
        }}
        onConfirm={handleDelete}
        title="Delete Designation"
        message={`Are you sure you want to delete "${selectedDesignation?.designationName}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

// Designation Form Component
const DesignationForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create", // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    designationName: initialData?.designationName || "",
    adminUserType: initialData?.adminUserType || "admin",
    permissions: initialData?.permissions || [],
  });

  // Reset form when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        designationName: initialData.designationName || "",
        adminUserType: initialData.adminUserType || "admin",
        permissions: initialData.permissions || [],
      });
      setSelectedCategories(
        Object.keys(PERMISSION_CATEGORIES).filter((categoryKey) =>
          PERMISSION_CATEGORIES[categoryKey].permissions.some((permission) =>
            initialData.permissions?.includes(permission)
          )
        )
      );
    } else {
      setFormData({
        designationName: "",
        adminUserType: "admin",
        permissions: [],
      });
      setSelectedCategories([]);
    }
  }, [initialData]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryToggle = (categoryKey) => {
    const category = PERMISSION_CATEGORIES[categoryKey];
    const categoryPermissions = category.permissions;

    setSelectedCategories((prev) => {
      const newSelected = prev.includes(categoryKey)
        ? prev.filter((key) => key !== categoryKey)
        : [...prev, categoryKey];

      // Update permissions based on selected categories
      const newPermissions = newSelected.flatMap(
        (key) => PERMISSION_CATEGORIES[key].permissions
      );

      setFormData((prev) => ({
        ...prev,
        permissions: newPermissions,
      }));

      return newSelected;
    });
  };

  // Handle select all permissions
  const handleSelectAll = () => {
    const allPermissions = Object.values(PERMISSION_CATEGORIES).flatMap(
      (category) => category.permissions
    );
    setFormData((prev) => ({
      ...prev,
      permissions: allPermissions,
    }));
    setSelectedCategories(Object.keys(PERMISSION_CATEGORIES));
  };

  // Handle clear all permissions
  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
    setSelectedCategories([]);
  };

  const handlePermissionToggle = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.designationName.trim()) {
      alert("Please enter a designation name");
      return;
    }

    if (formData.permissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation Name
          </label>
          <input
            type="text"
            value={formData.designationName}
            onChange={(e) =>
              handleInputChange("designationName", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter designation name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin User Type
          </label>
          <select
            value={formData.adminUserType}
            onChange={(e) => handleInputChange("adminUserType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {ADMIN_USER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Permissions</h3>

        {/* Category Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Select Categories
            </h4>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(PERMISSION_CATEGORIES).map(
              ([categoryKey, category]) => {
                const categoryPermissions = category.permissions;
                const selectedInCategory = categoryPermissions.filter(
                  (permission) => formData.permissions.includes(permission)
                ).length;
                const isFullySelected =
                  selectedInCategory === categoryPermissions.length;
                const isPartiallySelected =
                  selectedInCategory > 0 &&
                  selectedInCategory < categoryPermissions.length;

                return (
                  <label
                    key={categoryKey}
                    className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      isFullySelected
                        ? "border-blue-300 bg-blue-50"
                        : isPartiallySelected
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isFullySelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isPartiallySelected;
                        }
                      }}
                      onChange={() => handleCategoryToggle(categoryKey)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{category.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {category.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {selectedInCategory}/{categoryPermissions.length}
                      </span>
                    </div>
                  </label>
                );
              }
            )}
          </div>
        </div>

        {/* Individual Permission Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Individual Permissions ({formData.permissions.length} selected)
            </h4>
            <div className="text-xs text-gray-500">
              Total:{" "}
              {
                Object.values(PERMISSION_CATEGORIES).flatMap(
                  (cat) => cat.permissions
                ).length
              }
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {Object.entries(PERMISSION_CATEGORIES).map(
              ([categoryKey, category]) => (
                <div key={categoryKey} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2 p-2 bg-white rounded border">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{category.icon}</span>
                      <h5 className="text-sm font-medium text-gray-700">
                        {category.label}
                      </h5>
                    </div>
                    <span className="text-xs text-gray-500">
                      {
                        category.permissions.filter((p) =>
                          formData.permissions.includes(p)
                        ).length
                      }
                      /{category.permissions.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
                    {category.permissions.map((permission) => (
                      <label
                        key={permission}
                        className={`flex items-center text-xs p-2 rounded hover:bg-white transition-colors ${
                          formData.permissions.includes(permission)
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-600 flex-1">
                          {permission
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Permission Summary */}
      {formData.permissions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Permission Summary
          </h4>
          <div className="text-sm text-blue-800">
            <p className="mb-2">
              <strong>{formData.permissions.length}</strong> permissions
              selected across <strong>{selectedCategories.length}</strong>{" "}
              categories
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((categoryKey) => {
                const category = PERMISSION_CATEGORIES[categoryKey];
                const selectedCount = category.permissions.filter((p) =>
                  formData.permissions.includes(p)
                ).length;
                return (
                  <span
                    key={categoryKey}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {category.icon} {category.label} ({selectedCount})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <BiLoader className="w-4 h-4 mr-2 animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </div>
          ) : mode === "edit" ? (
            "Update Designation"
          ) : (
            "Create Designation"
          )}
        </button>
      </div>
    </form>
  );
};

// Designation View Component
const DesignationView = ({ designation }) => {
  if (!designation) return null;

  const typeConfig = ADMIN_USER_TYPES.find(
    (type) => type.value === designation.adminUserType
  );

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {designation.designationName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User Type
            </label>
            <div className="mt-1">
              <StatusChip
                status={designation.adminUserType}
                label={typeConfig?.label || designation.adminUserType}
                className={typeConfig?.color || "bg-gray-100 text-gray-800"}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Created At
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(designation.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Permissions
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {designation.permissions?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
        <div className="space-y-4">
          {Object.entries(PERMISSION_CATEGORIES).map(
            ([categoryKey, category]) => {
              const categoryPermissions = category.permissions.filter(
                (permission) => designation.permissions?.includes(permission)
              );

              if (categoryPermissions.length === 0) return null;

              return (
                <div
                  key={categoryKey}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-lg mr-2">{category.icon}</span>
                    <h4 className="text-sm font-medium text-gray-700">
                      {category.label}
                    </h4>
                    <span className="ml-2 text-xs text-gray-500">
                      ({categoryPermissions.length} permissions)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {categoryPermissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center text-xs text-gray-600"
                      >
                        <BiCheck className="w-3 h-3 text-green-500 mr-2" />
                        {permission
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignationManagementPage;
