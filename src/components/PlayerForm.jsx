import React, { useState } from "react";

const defaultForm = {
  username: "",
  fullname: "",
  phone: "",
  email: "",
  password: "",
  currency_id: 1,
  refer_code: "",
  isAgreeWithTerms: false,
  status: "active",
};

const PlayerForm = ({ initialValues, onSubmit, loading, isEdit }) => {
  const [form, setForm] = useState(
    initialValues ? { ...defaultForm, ...initialValues } : defaultForm
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.username ||
      !form.fullname ||
      !form.phone ||
      !form.email ||
      (!isEdit && !form.password)
    ) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    const submitData = { ...form };
    if (isEdit) delete submitData.password;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Username *</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Full Name *</label>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Phone *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Email *</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
            type="email"
          />
        </div>
      </div>
      {!isEdit && (
        <div>
          <label className="block text-xs font-medium mb-1">Password *</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
            type="password"
          />
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">
            Currency ID *
          </label>
          <input
            name="currency_id"
            value={form.currency_id}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
            type="number"
            min="1"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Refer Code</label>
          <input
            name="refer_code"
            value={form.refer_code}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isAgreeWithTerms"
          checked={form.isAgreeWithTerms}
          onChange={handleChange}
        />
        <label className="text-xs">Agree with terms *</label>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Status *</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold text-sm"
          disabled={loading}
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Player"
            : "Create Player"}
        </button>
      </div>
    </form>
  );
};

export default PlayerForm;
