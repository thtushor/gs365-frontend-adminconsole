import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SportList from "../SportInner/SportList";

const SportsProviderWiseSport = () => {
  const navigate = useNavigate();
  const { sportProviderInfo } = useAuth();
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Sport List of{" "}
          <span className="text-green-500">{sportProviderInfo?.name}</span>
        </h2>
        <button
          className="bg-green-500 text-white px-4 cursor-pointer py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={() => navigate("/add-sport")}
        >
          + Create Sport
        </button>
      </div>
      <div className="overflow-x-auto flex flex-col">
        <SportList providerId={sportProviderInfo?.id} />
      </div>
    </div>
  );
};

export default SportsProviderWiseSport;
