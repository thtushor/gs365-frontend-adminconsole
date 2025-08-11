import React, { useState, useRef } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CreateAgentForm } from "./shared/CreateAgentForm";

const defaultForm = {
  username: "",
  fullname: "",
  phone: "",
  email: "",
  password: "",
  role: "",
  country: "",
  city: "",
  street: "",
  minTrx: "",
  maxTrx: "",
  currency: 1, // Default to BDT
  status: "Active",
};

const roles = [
  { value: "", label: "Select Role" },
  { value: "agent", label: "Agent" },
  { value: "superAgent", label: "Super Agent" },
];
const CreateAgentPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef();
  const { user } = useAuth();

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await Axios.post(API_LIST.CREATE_AGENT, {
        ...data,
        createdBy: user.id,
      });

      console.log({ response });

      if (response.data.status) {
        setFormData(defaultForm);
        setModalOpen(true);
      } else {
        setError(response.data.message || "Failed to create agent");
      }
    } catch (err) {
      console.error("Error creating agent:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the agent"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    // Reset form
    setFormData(defaultForm);
    window.location.reload();
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
        <h2 className="text-lg font-semibold">CREATE AGENT</h2>
        <button
          onClick={handlePrint}
          className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
        >
          Print
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="border border-green-400 rounded-md bg-white p-6">
        <CreateAgentForm
          onSubmit={handleFormSubmit}
          initialValues={formData}
          isLoading={isLoading}
          isEdit={false}
          ref={formRef}
          roles={roles}
        />
      </div>

      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agent Created Successfully"
        onSave={handleConfirm}
      >
        <div className="text-green-600">
          Agent has been created successfully!
        </div>
      </ReusableModal>
    </div>
  );
};

export default CreateAgentPage;
