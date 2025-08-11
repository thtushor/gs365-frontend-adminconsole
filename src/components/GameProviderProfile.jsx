// pages/GameProviderProfile.js
import { useAuth } from "../hooks/useAuth";
import DepositBalance from "./GameProviderInner/DepositBalance";
import GameProviderInfo from "./GameProviderInner/GameProviderInfo";

const GameProviderProfile = () => {
  const { gameProviderInfo } = useAuth();

  if (!gameProviderInfo) return <div>Loading...</div>;

  return (
    <div className="p-0 space-y-6">
      <GameProviderInfo info={gameProviderInfo} />

      {/* TODO: Shufol bhaiya */}
      <DepositBalance info={gameProviderInfo} />
    </div>
  );
};

export default GameProviderProfile;
