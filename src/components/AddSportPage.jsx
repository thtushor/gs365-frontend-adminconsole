import React, { useState, useRef } from "react";
import ReusableModal from "./ReusableModal";

const defaultForm = {
  name: "",
  image: null,
  icon: "",
  apiSportId: "",
  coverImage: null,
  scoreboardBgColor: "#121212",
  scoreboardTextColor: "#121212",
  apiKey: "",
};

const mockProviders = [
  { value: "", label: "Select Provider" },
  { value: "provider1", label: "Provider One" },
  { value: "provider2", label: "Provider Two" },
];

function AddSportForm({ onSubmit, initialValues }) {
  const [form, setForm] = useState(initialValues || defaultForm);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" || name === "coverImage") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
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
      {/* Provider Select */}
      <div className="flex flex-col md:col-span-3">
        <label className="font-semibold text-xs mb-1">
          PROVIDER <span className="text-red-500">*</span>
        </label>
        <select
          className="border rounded px-3 py-2"
          name="provider"
          value={form.provider || ""}
          onChange={handleChange}
          required
        >
          {mockProviders.map((p) => (
            <option key={p.value} value={p.value} disabled={p.value === ""}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      {/* Row 1 */}
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
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          ICON <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="icon"
          placeholder="Icon"
          value={form.icon}
          onChange={handleChange}
          required
        />
      </div>
      {/* Row 2 */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          API SPORT ID <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="apiSportId"
          placeholder="API Sport ID"
          value={form.apiSportId}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          UPLOAD COVER IMAGE <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="coverImage"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          SCOREBOARD BACKGROUND COLOR <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="scoreboardBgColor"
          placeholder="#121212"
          value={form.scoreboardBgColor}
          onChange={handleChange}
          required
        />
      </div>
      {/* Row 3 */}
      <div className="flex flex-col md:col-span-2">
        <label className="font-semibold text-xs mb-1">
          SCOREBOARD TEXT COLOR <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="scoreboardTextColor"
          placeholder="#121212"
          value={form.scoreboardTextColor}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          API KEY <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="apiKey"
          placeholder="API Key for Sports/Casino"
          value={form.apiKey}
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
          Add Sports
        </button>
      </div>
    </form>
  );
}

const AddSportPage = () => {
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
    alert("Sport added!");
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
        <h2 className="text-lg font-semibold">ADD SPORTS</h2>
        <button
          onClick={handlePrint}
          className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6">
        <AddSportForm
          onSubmit={handleFormSubmit}
          initialValues={formData}
          ref={formRef}
        />
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Add Sport"
        onSave={handleConfirm}
      >
        <div>Are you sure you want to add this sport?</div>
      </ReusableModal>
    </div>
  );
};

export default AddSportPage;
