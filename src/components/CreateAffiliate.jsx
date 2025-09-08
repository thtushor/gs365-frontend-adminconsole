import React, { useState, useRef } from "react";
import ReusableModal from "./ReusableModal";
import Axios from "../api/axios";
import { API_LIST } from "../api/ApiList";
import { useAuth } from "../hooks/useAuth";
import { CreateAgentForm } from "./shared/CreateAgentForm";
import { Link } from "react-router-dom";

const defaultForm = {
  username: "",
  fullname: "",
  phone: "",
  email: "",
  password: "",
  role: "superAffiliate", // fixed role
  city: "",
  street: "",
  minTrx: "",
  maxTrx: "",
  currency: null,
  commission_percent: null,
  status: "active",
};

const CreateAffiliate = () => {
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
      const payload = {
        ...data,
        role: data?.refer_code ? "affiliate" : "superAffiliate",
        createdBy: user.id,
      };

      const response = await Axios.post(API_LIST.CREATE_ADMIN, payload);

      if (response.data.status) {
        setFormData(defaultForm);
        setModalOpen(true);
      } else {
        setError(response.data.message || "Failed to create affiliate");
      }
    } catch (err) {
      console.error("Error creating affiliate:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the affiliate"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    setFormData(defaultForm);
    window.location.reload();
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">CREATE AFFILIATE</h2>

        {isAdmin ? (
          <button
            onClick={handlePrint}
            className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
          >
            Print
          </button>
        ) : (
          <Link
            to={`/affiliate-list/${user?.id}`}
            className="border border-green-400 text-green-600 px-4 py-1 rounded hover:bg-green-50 print:hidden"
          >
            Back To Profile
          </Link>
        )}
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
          roles={[]}
          isAffiliate
          isRefVisible
        />
      </div>

      <ReusableModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Affiliate Created Successfully"
        onSave={handleConfirm}
      >
        <div className="text-green-600">
          Affiliate has been created successfully!
        </div>
      </ReusableModal>
    </div>
  );
};

export default CreateAffiliate;
