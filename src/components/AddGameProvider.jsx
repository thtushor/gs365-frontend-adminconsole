import React from "react";
import AddGameProviderForm from "./AddGameProviderForm";

const AddGameProvider = () => {
  return (
    <div>
      <AddGameProviderForm
        sectionTitle="ADD GAME PARENT PROVIDER"
        isParentProvider={false}
      />
    </div>
  );
};

export default AddGameProvider;
