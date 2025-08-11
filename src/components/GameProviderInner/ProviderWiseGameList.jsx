import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import GameList from "../GameInner/GameList";

const ProviderWiseGameList = () => {
  const navigate = useNavigate();
  const { gameProviderInfo } = useAuth();
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Game List of{" "}
          <span className="text-green-500">{gameProviderInfo?.name}</span>
        </h2>
        <button
          className="bg-green-500 text-white px-4 cursor-pointer py-1 rounded hover:bg-green-600 transition text-sm font-medium"
          onClick={() => navigate("/add-game")}
        >
          + Create Game
        </button>
      </div>
      <div className="overflow-x-auto flex flex-col">
        <GameList providerId={gameProviderInfo?.id} />
      </div>
    </div>
  );
};

export default ProviderWiseGameList;
