import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaEdit, FaTrash, FaSort, FaToggleOn } from "react-icons/fa";

const ActionDropdown = ({ 
  actions = [], 
  isLoading = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [showAbove, setShowAbove] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculatePosition = () => {
    if (!dropdownRef.current) return;

    const buttonRect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Estimate dropdown height (each action is ~40px + padding)
    const estimatedDropdownHeight = actions.length * 40 + 16;
    const dropdownWidth = 200; // Approximate width
    
    // Check if dropdown should appear above or below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const shouldShowAbove = spaceBelow < estimatedDropdownHeight && spaceAbove > estimatedDropdownHeight;
    
    setShowAbove(shouldShowAbove);
    
    // Calculate top position
    let top;
    if (shouldShowAbove) {
      top = buttonRect.top - estimatedDropdownHeight - 8;
    } else {
      top = buttonRect.bottom + 8;
    }
    
    // Calculate right position (ensure it doesn't go off-screen)
    let right = viewportWidth - buttonRect.right;
    if (right + dropdownWidth > viewportWidth) {
      right = viewportWidth - dropdownWidth - 8;
    }
    if (right < 8) {
      right = 8;
    }
    
    setDropdownPosition({ top, right });
  };

  const handleToggle = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        title="Actions"
      >
        <FaEllipsisV size={14} />
      </button>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999]"
          onClick={() => setIsOpen(false)}
        >
          <div 
            ref={dropdownMenuRef}
            className="absolute bg-white rounded-md shadow-xl border border-gray-200 min-w-max max-h-[300px] overflow-y-auto"
            style={{
              top: dropdownPosition.top,
              right: dropdownPosition.right,
              zIndex: 10000,
              maxHeight: '300px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled || isLoading}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-2
                    ${action.className || "hover:bg-gray-100"}
                    ${(action.disabled || isLoading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                  <span className="flex-1">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown; 