import React from "react";
import AddSportProviderForm from "./AddSportProviderForm";

const AddSportProvider = () => {
  return (
    <div>
      <AddSportProviderForm
        sectionTitle="ADD PARENT PROVIDER"
        isParentProvider={false}
      />
    </div>
  );
};

export default AddSportProvider;
