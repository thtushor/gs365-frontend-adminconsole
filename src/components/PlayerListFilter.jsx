import { useState } from "react";

const PlayerListFilter = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
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
      currencyId: "",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap gap-3 items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="playerId"
          placeholder="Player ID"
          value={localFilters.playerId}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
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
        <input
          type="text"
          name="createdBy"
          placeholder="Created By"
          value={localFilters.createdBy}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 text-sm sm:w-40 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
        />
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
        <div className="flex gap-2">
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
