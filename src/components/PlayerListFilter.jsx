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

  return (
    <form
      className="flex flex-wrap gap-2 items-center mb-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="playerId"
        placeholder="Player ID"
        value={localFilters.playerId}
        onChange={handleInputChange}
        className="border rounded max-md:flex-1 px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
      <input
        type="text"
        name="phone"
        placeholder="Mobile Number"
        value={localFilters.phone}
        onChange={handleInputChange}
        className="border rounded max-md:flex-1 px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
      <select
        name="status"
        value={localFilters.status}
        onChange={handleInputChange}
        className="border max-md:flex-1 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        {/* <option value="suspended">Suspended</option> */}
      </select>
      <button
        type="submit"
        className="bg-green-500 max-md:flex-1 text-white px-6 py-2 rounded hover:bg-green-600 transition text-sm font-medium"
      >
        Apply
      </button>
      <input
        type="text"
        name="keyword"
        placeholder="Search keywords..."
        value={localFilters.keyword}
        onChange={handleInputChange}
        className="border max-md:flex-1 rounded px-3 py-2 text-sm flex-1 min-w-[180px] md:ml-4 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </form>
  );
};

export default PlayerListFilter;
