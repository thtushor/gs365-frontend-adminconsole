import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCurrencies } from "./useCurrencies";
import Select from "react-select";

const defaultForm = {
  username: "",
  fullname: "",
  phone: "",
  email: "",
  password: "",
  role: "",
  city: "",
  street: "",
  minTrx: "",
  maxTrx: "",
  currency: null,
  commission_percent: null,
  status: "active",
  refCode: "",
};

export function CreateAgentForm({
  onSubmit,
  initialValues,
  isLoading,
  isEdit,
  isRefVisible = false,
  roles,
  isAffiliate = false,
}) {
  const { data: currencyList, isLoading: currencyLoading } = useCurrencies();

  // Format options for react-select
  const currencyOptions =
    currencyList?.map((currency) => ({
      value: currency.id,
      label: `${currency.name} (${currency.code})`,
    })) || [];
  const [form, setForm] = useState(initialValues || defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  console.log(form);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAffiliate) {
      if (!form.commission_percent) {
        return alert("Commission percentage is not required.");
      }
    }
    onSubmit(form);
  };

  useEffect(() => {
    if (!form.currency && currencyList) {
      const bdtCurrency = currencyList.find(
        (c) => c.id === 11 || c.code === "BDT"
      );
      if (bdtCurrency) {
        setForm((prev) => ({ ...prev, currency: bdtCurrency.id })); // save just the id
      }
    }
  }, [currencyList]);

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      onSubmit={handleSubmit}
    >
      {!isAffiliate && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">
            ROLE <span className="text-red-500">*</span>
          </label>
          <select
            className="border rounded px-3 py-2"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          USERNAME <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          FULL NAME <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
        />
      </div>
      {/* Row 2 */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          EMAIL ADDRESS <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          PHONE NUMBER <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          type="number"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          COMMISSION % <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="commission_percent"
          placeholder="Commission %"
          value={form.commission_percent}
          onChange={handleChange}
          required
          type="number"
        />
      </div>
      {!isEdit && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">
            PASSWORD <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border rounded px-3 py-2 pr-10 w-full"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}
      {/* Currency Dropdown */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">CURRENCY</label>
        {currencyLoading ? (
          <p className="text-gray-500 text-sm">Loading currencies...</p>
        ) : (
          <Select
            options={currencyOptions}
            value={
              currencyOptions.find((opt) => opt.value === form.currency) || null
            }
            onChange={(selected) => {
              setForm((prev) => ({
                ...prev,
                currency: selected ? selected.value : null,
              }));
            }}
            isSearchable
            placeholder="Select Currency"
            styles={{
              menuList: (base) => ({
                ...base,
                maxHeight: "300px",
                overflowY: "auto",
              }),
            }}
          />
        )}
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">CITY</label>
        <input
          className="border rounded px-3 py-2"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">STREET</label>
        <input
          className="border rounded px-3 py-2"
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
        />
      </div>
      {/* Row 4 */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          MINIMUM TRANSACTION <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="minTrx"
          type="number"
          min="0"
          placeholder="Minimum Transaction"
          value={form.minTrx}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          MAXIMUM TRANSACTION <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="maxTrx"
          type="number"
          min="0"
          placeholder="Maximum Transaction"
          value={form.maxTrx}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          STATUS <span className="text-red-500">*</span>
        </label>
        <select
          className="border rounded px-3 py-2"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isRefVisible && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">REFERRAL CODE</label>
          <input
            className="border rounded px-3 py-2"
            name="refCode"
            placeholder="Referral Code"
            value={form.refCode}
            onChange={handleChange}
          />
        </div>
      )}
      {/* Button row */}
      <div className="md:col-span-3 flex justify-end mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded font-medium transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isLoading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update"
            : isAffiliate
            ? "Create Affiliate"
            : "Create Agent"}
        </button>
      </div>
    </form>
  );
}
