// components/affiliate/SettingsForm.js
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Axios from "axios";
import { API_LIST, BASE_URL } from "../api/ApiList";

const PlayerPasswordChange = ({ info }) => {
  console.log(info);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    fullName: info.fullname || "",
    email: info.email || "",
    phone: info.phone || "",
    newPassword: "",
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...formData }) => {
      const payload = {
        id: info?.id,
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      };
      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const token = localStorage.getItem("token");

      const res = await Axios.post(
        `${BASE_URL}${API_LIST.EDIT_PLAYERS}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data.status)
        throw new Error(res.data.message || "Update failed");

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["affiliates"]);
      toast.success("User updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!form.newPassword) {
      return toast.error("Please provide a new password!");
    }
    updateMutation.mutate({ id: info.id, ...form });
  };

  return (
    <div className="bg-white p-4 rounded-md mt-4">
      <h1 className="mt-[-5px] text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 pt-[2px] mb-2">
        Settings
      </h1>
      <form onSubmit={handleUpdate} className="space-y-3 ">
        <input
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded bg-white opacity-70 pointer-events-none"
          readOnly
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded bg-white opacity-70 pointer-events-none"
          readOnly
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded bg-white opacity-70 pointer-events-none"
          readOnly
        />
        <input
          type="text"
          placeholder="New Password (optional)"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="w-full p-2 border rounded bg-white"
        />
        <button
          type="submit"
          className="bg-green-500 cursor-pointer font-medium hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PlayerPasswordChange;
