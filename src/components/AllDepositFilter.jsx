const AllDepositFilter = () => (
  <form className="flex flex-wrap gap-2 items-center mb-4">
    <input
      type="text"
      placeholder="Player ID"
      className="border flex-1 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
    />
    <input
      type="text"
      placeholder="Mobile Number"
      className="border flex-1 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
    />
    <select className="border flex-1 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200">
      <option value="">Select Status</option>
      <option value="paid">Paid</option>
      <option value="unpaid">Unpaid</option>
      <option value="cancel">Cancel</option>
    </select>
    <input
      type="text"
      placeholder="Transaction ID"
      className="border flex-1 rounded px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-green-200"
    />
    <button
      type="submit"
      className="bg-green-500 flex-1 text-white px-6 py-2 rounded hover:bg-green-600 transition text-sm font-medium"
    >
      Apply
    </button>
    <input
      type="text"
      placeholder="Search keywords..."
      className="border rounded px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-green-200"
    />
  </form>
);

export default AllDepositFilter;
