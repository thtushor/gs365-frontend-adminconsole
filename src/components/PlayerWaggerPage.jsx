import React from "react";
import { useParams } from "react-router-dom";
import TransactionsPage from "./TransactionsPage";
import BettingWagerPage from "./BettingWagerPage";

const PlayerWagerPage = () => {
  const { playerId } = useParams();
  
  return (
    <BettingWagerPage 
      playerId={playerId}
      title="Player Transactions"
    />
  );
};

export default PlayerWagerPage;
