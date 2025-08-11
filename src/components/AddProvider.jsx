import React, { useState } from "react";
import ReusableModal from "./ReusableModal";

const defaultForm = {
  logo: null,
  name: "",
  key: "",
  ip: "",
};

const AddProvider = () => {
  const [form, setForm] = useState(defaultForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files && files[0]) {
      setForm((prev) => ({ ...prev, logo: files[0] }));
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    alert("Provider added!");
    setForm(defaultForm);
    setLogoPreview(null);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">ADD PROVIDER</h2>
        <button
          className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <div className="border border-green-400 rounded-md bg-white p-6 max-w-2xl mx-auto">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PROVIDER NAME <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="name"
              placeholder="Provider Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PROVIDER KEY <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="key"
              placeholder="Provider Key"
              value={form.key}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PROVIDER IP <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="ip"
              placeholder="Provider IP"
              value={form.ip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-xs mb-1">
              PROVIDER LOGO <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="mt-2 w-20 h-20 object-contain border rounded"
              />
            )}
          </div>
          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-medium"
            >
              Add Provider
            </button>
          </div>
        </form>
      </div>
      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Add Provider"
        onSave={handleConfirm}
      >
        <div>Are you sure you want to add this provider?</div>
      </ReusableModal>
    </div>
  );
};

export default AddProvider;
