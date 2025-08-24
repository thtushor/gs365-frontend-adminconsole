import React, { useEffect } from "react";
import CreateDropdown from "./CreateDropdown";
import DropdownList from "./DropdownList";

const DropdownConfiguration = () => {
  const [editedData, setEditedData] = React.useState(null);
  useEffect(() => {
    if (editedData && editedData?.id) {
      const scrollContainer = document.getElementById("layout-scroll");
      if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
      }
    }
  }, [editedData]);
  return (
    <div className="bg-[#f5f5f5] w-full min-h-full p-4">
      <CreateDropdown editedData={editedData} setEditedData={setEditedData} />
      <DropdownList setEditedData={setEditedData} />
    </div>
  );
};

export default DropdownConfiguration;
