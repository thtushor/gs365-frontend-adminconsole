import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { API_LIST, BASE_URL } from "../api/ApiList";
import {
  useGetRequest,
  usePostRequest,
  useUpdateRequest,
} from "../Utils/apiClient";
import { FaRegEdit } from "react-icons/fa";
import MenuTable from "./MenuTable";
import BaseModal from "./shared/BaseModal";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import StatusChangePopup from "./inner_component/StatusChangePopup";

const MenuManagement = () => {
  const getRequest = useGetRequest();
  const postRequest = usePostRequest();
  const queryClient = useQueryClient();
  const updateDropdownStatus = useUpdateRequest();

  const {
    data: menuList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_ALL_MENUS,
        errorMessage: "Failed to fetch menus list",
      }),
    keepPreviousData: true,
  });

  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [priorityValue, setPriorityValue] = useState("");

  // Update menus when API data changes
  useEffect(() => {
    const gameMenus = menuList?.data?.game_providers || [];
    const sportMenus = menuList?.data?.sports_providers || [];
    const categoryMenus = menuList?.data?.category_menu || [];

    const mergedMenus = [
      ...gameMenus.map((item) => ({ ...item, type: "game" })),
      ...sportMenus.map((item) => ({ ...item, type: "sports" })),
      ...categoryMenus.map((item) => ({ ...item, type: "category" })),
    ];

    setMenus(mergedMenus);
  }, [menuList]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditClick = (menu) => {
    setIsModalOpen(true);
    setSelectedMenu(menu);
    setPriorityValue(menu.menuPriority || 0); // ✅ good
  };

  const mutation = useMutation({
    mutationFn: ({ url, payload }) => postRequest({ url, body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const [updateLoading, setUpdateLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMenu) return;

    try {
      setUpdateLoading(true);

      const payload = {
        id: selectedMenu.id,
        type: selectedMenu.type,
        currentPosition: selectedMenu.menuPriority, // old position
        updatedPosition: Number(priorityValue), // new position typed by user
      };

      const url = BASE_URL + API_LIST.UPDATE_MENU_PRIORITY;

      await mutation.mutateAsync({ url, payload });

      // Refresh menu list after update
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedMenu(null);
      setPriorityValue("");
      setUpdateLoading(false);
      setIsModalOpen(false);
    }
  };

  // status change function
  const [children, setChildren] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const handleChangeStatus = async (data) => {
    const newStatus = data.isMenu ? "inactive" : "active";

    try {
      setUpdateLoading(true);

      const payload = {
        id: selectedMenu.id,
        type: selectedMenu.type,
        updatedStatus: newStatus,
      };

      const url = BASE_URL + API_LIST.UPDATE_MENU_PRIORITY;

      await mutation.mutateAsync({ url, payload });

      // Close modal
      setStatusModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleStatusToggle = (row) => {
    setSelectedMenu(row);
    setStatusModalOpen(true);
    setChildren(
      <StatusChangePopup
        row={row}
        onCancel={() => setStatusModalOpen(false)}
        onConfirm={handleChangeStatus}
      />
    );
  };

  const columns = [
    {
      field: "sl",
      headerName: "SL",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      field: "titleOrName",
      headerName: "Title/Name",
      width: 200,
      render: (value, row) => (
        <p className="font-semibold">{row.name || row.title || "N/A"}</p>
      ),
    },
    {
      field: "createdAtOrCreatedAt",
      headerName: "Created At",
      width: 180,
      render: (value, row) => {
        const dateValue = row.createdAt || row.created_at;
        return dateValue ? new Date(dateValue).toLocaleString() : "N/A";
      },
    },
    {
      field: "menuPriority",
      headerName: "Position",
      width: 60,
      align: "center",
      render: (value, index) => (
        <p className="text-white bg-green-500 mx-auto w-[35px] h-[35px] flex items-center justify-center text-[16px] font-semibold rounded-md">
          {value}
        </p>
      ),
    },
    {
      field: "isMenu",
      headerName: "Is Menu?",
      align: "center",
      width: 100,
      render: (value, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent row toggle
            handleStatusToggle(row);
          }}
          className="cursor-pointer"
        >
          {value ? (
            <MdToggleOn className="text-green-500" size={33} />
          ) : (
            <MdToggleOff className="text-red-500" size={33} />
          )}
        </button>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      render: (value) => (
        <span
          className={`px-2 py-1 text-center pb-[5px] font-semibold block rounded-full capitalize text-xs ${
            value === "active"
              ? "text-green-500 bg-green-100 border border-green-500"
              : "text-red-500 bg-red-100 border border-red-500"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      align: "center",
      render: (_, row) => (
        <div className="flex gap-3 items-center justify-center">
          <div
            className="text-blue-500 hover:text-blue-800 cursor-pointer"
            onClick={() => handleEditClick(row)}
          >
            <FaRegEdit size={18} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <div className="bg-white rounded-lg overflow-auto max-w-full shadow p-4 min-h-[200px] flex flex-col justify-center items-center">
        <div className="text-left mb-4 w-full">
          <h2 className="text-lg font-semibold text-left">Menu Management</h2>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading menus...</div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load menus
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No menus found.</div>
        ) : (
          <MenuTable columns={columns} data={menus} />
        )}

        {/* Modal */}
        <BaseModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form
            className="p-4 px-5 pb-5 flex flex-col gap-4 w-full bg-white rounded-xl"
            onSubmit={handleSubmit}
          >
            <h3 className="text-[18px] font-semibold">
              Update Priority for{" "}
              <span className="text-green-500">
                {selectedMenu?.name || selectedMenu?.title}
              </span>
            </h3>
            <input
              type="number"
              value={priorityValue}
              onChange={(e) => setPriorityValue(e.target.value)}
              className="border border-green-500 bg-green-50 outline-green-500 rounded px-3 py-[6px] w-full"
              required
              min={0}
              max={menus?.length || 1}
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-[6px] font-semibold rounded-lg hover:bg-green-600 cursor-pointer"
              disabled={updateLoading}
              placeholder="Enter position number"
            >
              {updateLoading ? "Updating..." : "Update Priority"}
            </button>
          </form>
        </BaseModal>
      </div>

      <BaseModal
        children={children}
        onClose={() => setStatusModalOpen(false)}
        open={statusModalOpen}
      />
    </div>
  );
};

export default MenuManagement;
