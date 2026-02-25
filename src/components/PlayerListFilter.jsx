import { useState, useMemo } from "react";
import Select from "react-select";

const PlayerListFilter = ({
  filters,
  onChange,
  users = [],
  admins = [],
  affiliates = [],
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const userOptions = useMemo(
    () => [
      { value: "", label: "Select Player" },
      ...users.map((user) => ({
        value: user.id,
        label: `${user.fullname || ""} (${user.username}) (${user.id})`,
      })),
    ],
    [users]
  );

  const onlyAdminOptions = useMemo(() => [
    { value: "", label: "Created By" },
    ...admins.map((a) => ({
      value: a.id,
      label: `${a.username} (${a.role})`,
    })),
  ], [admins]);

  const adminUserOptions = useMemo(() => {
    const mapAdmin = (a) => ({
      value: a.id,
      label: `${a.fullname || ""} (${a.username}) (${a.role})`,
    });

    return [
      { value: "", label: "All Users" },
      {
        label: "Admins",
        options: admins.map(mapAdmin),
      },
      {
        label: "Affiliates",
        options: affiliates.map(mapAdmin),
      },
    ];
  }, [admins, affiliates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, option) => {
    setLocalFilters((prev) => ({ ...prev, [name]: option ? option.value : "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      playerId: "",
      phone: "",
      status: "",
      keyword: "",
      page: 1,
      pageSize: 20,
      createdBy: "",
      referred_by: "",
      referred_by_admin_user: "",
      currencyId: "",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#e5e7eb",
      "&:hover": {
        borderColor: "#e5e7eb",
      },
      boxShadow: "none",
      minHeight: "38px",
    }),
    groupHeading: (base) => ({
      ...base,
      color: "#10b981",
      fontWeight: "bold",
      fontSize: "0.75rem",
      textTransform: "uppercase",
    }),
  };

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap gap-3 items-center"
        onSubmit={handleSubmit}
      >
        <div className="sm:w-60 w-full">
          <Select
            value={userOptions.find((opt) => opt.value === localFilters.playerId)}
            onChange={(opt) => handleSelectChange("playerId", opt)}
            options={userOptions}
            isSearchable
            placeholder="Search Player..."
            className="w-full text-sm"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>
        <input
          type="text"
          name="phone"
          placeholder="Mobile Number"
          value={localFilters.phone}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          name="status"
          value={localFilters.status}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="sm:w-52 w-full">
          <Select
            value={onlyAdminOptions.find(
              (opt) => opt.value === localFilters.createdBy
            )}
            onChange={(opt) => handleSelectChange("createdBy", opt)}
            options={onlyAdminOptions}
            isSearchable
            placeholder="Created By Admin"
            className="w-full text-sm"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>

        <div className="sm:w-52 w-full">
          <Select
            value={adminUserOptions
              .flatMap((g) => g.options || [g])
              .find((opt) => opt.value === localFilters.referred_by_admin_user)}
            onChange={(opt) => handleSelectChange("referred_by_admin_user", opt)}
            options={adminUserOptions}
            isSearchable
            placeholder="Referred By Admin/Aff"
            className="w-full text-sm"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>

        <div className="sm:w-52 w-full">
          <Select
            value={userOptions.find(
              (opt) => opt.value === localFilters.referred_by
            )}
            onChange={(opt) => handleSelectChange("referred_by", opt)}
            options={userOptions}
            isSearchable
            placeholder="Referred By Player"
            className="w-full text-sm"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>

        <input
          type="text"
          name="currencyId"
          placeholder="Currency ID"
          value={localFilters.currencyId}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="date"
          name="dateFrom"
          placeholder="Date From"
          value={localFilters.dateFrom}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="date"
          name="dateTo"
          placeholder="Date To"
          value={localFilters.dateTo}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <input
          type="text"
          name="keyword"
          placeholder="Search keywords..."
          value={localFilters.keyword}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <div className="ml-auto flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition text-sm font-medium"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerListFilter;
