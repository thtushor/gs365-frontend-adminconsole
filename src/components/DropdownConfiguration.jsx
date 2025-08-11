import React from "react";
import CreateDropdown from "./CreateDropdown";
import DropdownList from "./DropdownList";

const DropdownConfiguration = () => {
  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <CreateDropdown />
      <DropdownList />
    </div>
  );
};

export default DropdownConfiguration;
