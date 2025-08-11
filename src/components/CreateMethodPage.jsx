import React, { useState, useRef } from "react";
import ReusableModal from "./ReusableModal";

const defaultForm = {
  role: "",
  name: "",
  currency: "BDT (Bangladesh Taka)",
  image: null,
};

const roles = [
  { value: "", label: "Select Role" },
  { value: "Bank", label: "Bank" },
  { value: "Card", label: "Card" },
  { value: "Mobile", label: "Mobile" },
];
const currencies = [
  { value: "BDT (Bangladesh Taka)", label: "BDT (Bangladesh Taka)" },
  // Add more currencies as needed
];

function CreateMethodForm({ onSubmit, initialValues }) {
  const [form, setForm] = useState(initialValues || defaultForm);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      onSubmit={handleSubmit}
    >
      {/* Row 1 */}
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
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          NAME <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          CURRENCY <span className="text-red-500">*</span>
        </label>
        <select
          className="border rounded px-3 py-2"
          name="currency"
          value={form.currency}
          onChange={handleChange}
          required
        >
          {currencies.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {/* Row 2 */}
      <div className="flex flex-col md:col-span-3">
        <label className="font-semibold text-xs mb-1">
          UPLOAD IMAGE <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>
      {/* Button row */}
      <div className="md:col-span-3 flex justify-end mt-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-medium"
        >
          Create Method
        </button>
      </div>
    </form>
  );
}

const CreateMethodPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const formRef = useRef();

  const handleFormSubmit = (data) => {
    setFormData(data);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    // Here you would handle the actual creation logic
    alert("Payment method created!");
    setFormData(defaultForm);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">CREATE METHOD</h2>
        <button
          onClick={handlePrint}
          className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6">
        <CreateMethodForm
          onSubmit={handleFormSubmit}
          initialValues={formData}
          ref={formRef}
        />
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Method Creation"
        onSave={handleConfirm}
      >
        <div>Are you sure you want to create this payment method?</div>
      </ReusableModal>
    </div>
  );
};

export default CreateMethodPage;
