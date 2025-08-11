import React, { useState, useMemo, useEffect } from "react";
import { FaSave, FaSearch } from "react-icons/fa";

// Define roles
const roles = ["Owner", "Admin", "Finance", "Support"];
const permissionTypes = ["view", "create", "update", "delete"];
const permLabels = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};
const permColors = {
  view: "text-blue-600",
  create: "text-green-600",
  update: "text-yellow-600",
  delete: "text-red-600",
};

function flattenMenu(menuArr, parent = "") {
  let items = [];
  for (const m of menuArr) {
    if (m.path) {
      items.push({
        label: m.label,
        path: m.path,
        onlyOwner: m.onlyOwner || false,
        parent,
      });
    }
    if (m.children) {
      items = items.concat(flattenMenu(m.children, m.label));
    }
  }
  return items;
}

const OwnerPermissionPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [search, setSearch] = useState("");
  const [unsaved, setUnsaved] = useState(false);
  const [activePerm, setActivePerm] = useState("view");
  const [showToast, setShowToast] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [changedCells, setChangedCells] = useState({});

  // Dynamically import menu to avoid circular dependency
  useEffect(() => {
    import("../Utils/menu.jsx").then((mod) => {
      const items = flattenMenu(mod.menu);
      setMenuItems(items);
      // Mock initial permissions: all roles can view, only Owner can CRUD
      const defaultPermissions = {};
      items.forEach((item) => {
        defaultPermissions[item.path] = {};
        roles.forEach((role) => {
          defaultPermissions[item.path][role] = {
            view: true,
            create: role === "Owner",
            update: role === "Owner",
            delete: role === "Owner",
          };
        });
      });
      setPermissions(defaultPermissions);
    });
  }, []);

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    if (!search) return menuItems;
    return menuItems.filter(
      (item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.path.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, menuItems]);

  // Filtered roles
  const filteredRoles = useMemo(() => {
    if (roleFilter === "All") return roles;
    return [roleFilter];
  }, [roleFilter]);

  // Handle permission toggle
  function handleToggle(path, role, perm) {
    setPermissions((prev) => {
      const updated = { ...prev };
      updated[path] = { ...updated[path] };
      updated[path][role] = { ...updated[path][role] };
      // Always allow view to be toggled, but for create/update/delete, only if not onlyOwner
      if (
        perm === "view" ||
        role === "Owner" ||
        !menuItems.find((m) => m.path === path).onlyOwner
      ) {
        updated[path][role][perm] = !updated[path][role][perm];
        setUnsaved(true);
        setChangedCells((prevCells) => ({
          ...prevCells,
          [`${path}|${role}|${perm}`]: true,
        }));
      }
      return updated;
    });
  }

  // Batch toggle for a role/perm
  function handleToggleAll(role, perm) {
    setPermissions((prev) => {
      const updated = { ...prev };
      filteredMenu.forEach((item) => {
        if (perm === "view" || role === "Owner" || !item.onlyOwner) {
          if (!updated[item.path]) updated[item.path] = {};
          if (!updated[item.path][role]) updated[item.path][role] = {};
          updated[item.path][role][perm] = !filteredMenu.every(
            (i) => updated[i.path]?.[role]?.[perm]
          );
          setChangedCells((prevCells) => ({
            ...prevCells,
            [`${item.path}|${role}|${perm}`]: true,
          }));
        }
      });
      setUnsaved(true);
      return updated;
    });
  }

  function handleSave() {
    setUnsaved(false);
    setShowToast(true);
    setChangedCells({});
    setTimeout(() => setShowToast(false), 2000);
  }

  // Summary
  const totalMenus = menuItems.length;
  const totalRoles = roles.length;

  // For batch toggle: is every checkbox checked for this role/perm?
  function isAllChecked(role, perm) {
    return (
      filteredMenu.length > 0 &&
      filteredMenu.every(
        (item) =>
          permissions[item.path]?.[role]?.[perm] ||
          (perm !== "view" && item.onlyOwner && role !== "Owner")
      )
    );
  }

  // For batch toggle: is every checkbox disabled for this role/perm?
  function isAllDisabled(role, perm) {
    return filteredMenu.every(
      (item) => perm !== "view" && item.onlyOwner && role !== "Owner"
    );
  }

  return (
    <div className="p-6 bg-[#f5f5f5] min-h-full">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
          Permissions saved!
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Menu Permission Control</h2>
          <div className="text-gray-600 text-sm">
            Control which roles can access each menu and what actions they can
            perform.
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="bg-white rounded shadow px-4 py-2 text-sm">
            <b>{totalMenus}</b> Menus | <b>{totalRoles}</b> Roles
          </div>
          <select
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded text-white font-semibold transition ${
              unsaved
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSave}
            disabled={!unsaved}
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </div>
      {/* Permission Type Tabs */}
      <div className="flex gap-2 mb-4">
        {permissionTypes.map((perm) => (
          <button
            key={perm}
            className={`px-4 py-2 rounded font-semibold border transition ${
              activePerm === perm
                ? `${permColors[perm]} border-green-500 bg-green-50`
                : "text-gray-500 border-gray-200 bg-white hover:bg-gray-100"
            }`}
            onClick={() => setActivePerm(perm)}
          >
            {permLabels[perm]}
          </button>
        ))}
      </div>
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded border w-full focus:ring-2 focus:ring-green-200"
            placeholder="Search menu or path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold border-b">
                Menu
              </th>
              <th className="px-4 py-3 text-left font-semibold border-b">
                Path
              </th>
              {filteredRoles.map((role) => (
                <th
                  key={role}
                  className="px-4 py-3 text-center font-semibold border-b"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{role}</span>
                    <input
                      type="checkbox"
                      className="accent-green-500"
                      checked={isAllChecked(role, activePerm)}
                      disabled={isAllDisabled(role, activePerm)}
                      onChange={() => handleToggleAll(role, activePerm)}
                      title={
                        isAllDisabled(role, activePerm)
                          ? "Only Owner can change this permission"
                          : isAllChecked(role, activePerm)
                          ? `Uncheck all for ${role}`
                          : `Check all for ${role}`
                      }
                    />
                    <span className="text-xs text-gray-400">All</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMenu.map((item, idx) => (
              <tr
                key={item.path}
                className={`transition hover:bg-green-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {item.label}
                  {item.onlyOwner && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      Owner Only
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                  {item.path}
                </td>
                {filteredRoles.map((role) => {
                  const isDisabled =
                    activePerm !== "view" && item.onlyOwner && role !== "Owner";
                  const cellKey = `${item.path}|${role}|${activePerm}`;
                  return (
                    <td key={role} className="px-2 py-2 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <label
                          className={`inline-flex items-center gap-1 cursor-pointer ${permColors[activePerm]}`}
                          title={
                            isDisabled
                              ? "Only Owner can change this permission"
                              : undefined
                          }
                        >
                          <input
                            type="checkbox"
                            className="accent-green-500"
                            checked={
                              permissions[item.path]?.[role]?.[activePerm] ||
                              false
                            }
                            onChange={() =>
                              handleToggle(item.path, role, activePerm)
                            }
                            disabled={isDisabled}
                          />
                          <span className="text-xs">
                            {permLabels[activePerm]}
                          </span>
                        </label>
                        {changedCells[cellKey] && unsaved && (
                          <span
                            className="block w-2 h-2 rounded-full bg-yellow-400 mt-1 animate-pulse"
                            title="Unsaved change"
                          ></span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredMenu.length === 0 && (
              <tr>
                <td
                  colSpan={2 + filteredRoles.length}
                  className="text-center py-8 text-gray-400"
                >
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerPermissionPage;
