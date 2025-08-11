import React, { useState } from "react";
import ThumbnailImage from "./ThumbnailImage";
import FileInput from "./FileInput";

const AddPopularSports = () => {
  const [form, setForm] = useState({
    name: "",
    image: null,
    url: "",
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
    alert("Popular sport added! (Demo)");
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
      <div
        className="border border-green-300 rounded-md bg-white p-4 max-w-full"
        // style={{ minWidth: 600 }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:items-center gap-4"
        >
          <div className="flex-1 min-w-[180px]">
            <label className="block mb-1 font-medium text-xs text-gray-700">
              NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full text-sm"
              placeholder="Name"
              required
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block mb-1 font-medium text-xs text-gray-700">
              UPLOAD IMAGE <span className="text-red-500">*</span>
            </label>
            <FileInput name="image" required onChange={handleChange} />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block mb-1 font-medium text-xs text-gray-700">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full text-sm"
              placeholder="https://www.glorybet.com"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold text-sm"
              style={{ marginTop: 22 }}
            >
              Add Popular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPopularSports;
