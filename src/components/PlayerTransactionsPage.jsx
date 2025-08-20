import React from "react";
import { useParams } from "react-router-dom";
import TransactionsPage from "./TransactionsPage";

const PlayerTransactionsPage = () => {
  const { playerId } = useParams();
  
  return (
    <TransactionsPage 
      playerId={playerId}
      title="Player Transactions"
    />
  );
};

export default PlayerTransactionsPage;
