import React, { useState } from "react";
import FileInput from "./FileInput";

const mockCountries = ["Bangladesh", "India", "UK", "USA", "Germany"];

const AddLanguage = () => {
  const [form, setForm] = useState({
    image: null,
    country: "",
    name: "",
    json: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic here
    alert("Language added! (Demo)");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="flex justify-end mb-2">
        <button
          className="border border-green-400 text-green-700 px-6 py-1 rounded hover:bg-green-50 transition font-medium"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <div className="border border-green-300 rounded-md bg-white p-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">ADD LANGUAGE</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block mb-1 font-medium text-xs text-gray-700">
                UPLOAD IMAGE <span className="text-red-500">*</span>
              </label>
              <FileInput name="image" required onChange={handleChange} />
            </div>
            <div className="flex-1 w-full">
              <label className="block mb-1 font-medium text-xs text-gray-700">
                COUNTRY <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full text-sm"
                required
              >
                <option value="">Select</option>
                {mockCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block mb-1 font-medium text-xs text-gray-700">
                NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-xs text-gray-700">
              JSON DATA
            </label>
            <textarea
              name="json"
              value={form.json}
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 w-full text-sm min-h-[100px]"
              placeholder="Write..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 transition font-semibold text-sm"
            >
              Add Language
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLanguage;
