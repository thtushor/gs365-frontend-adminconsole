import React from "react";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const ToggleButton = ({ title = "Title", toggleName, form, setForm }) => {
  const isActive = form[toggleName];

  const handleToggle = () => {
    setForm((prev) => ({
      ...prev,
      [toggleName]: !prev[toggleName],
    }));
  };

  return (
    <div>
      <label
        className={`block text-[14px] font-medium ${
          isActive ? "text-green-500" : "text-red-500"
        }`}
      >
        {title}
      </label>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full border  flex items-center justify-between px-2 pr-1 gap-2 rounded-md cursor-pointer ${
          isActive
            ? "text-green-500 border-green-500"
            : "text-red-500 border-red-500"
        }`}
      >
        <span>{title}</span>
        {isActive ? <MdToggleOn size={28} /> : <MdToggleOff size={28} />}
      </button>
    </div>
  );
};

export default ToggleButton;
