import { useAuth } from "../../hooks/useAuth";
import SportProviderInfo from "./SportProviderInfo";

const SportProviderProfile = () => {
  const { sportProviderInfo } = useAuth();

  if (!sportProviderInfo) return <div>Loading...</div>;

  return (
    <div className="p-0 space-y-6">
      <SportProviderInfo info={sportProviderInfo} />
    </div>
  );
};

export default SportProviderProfile;
