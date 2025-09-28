import { useState, useRef } from "react";
import { createPortal } from "react-dom";

// Portal Tooltip Component
const PortalTooltip = ({
  isVisible,
  position,
  bubblePosition,
  content,
  tooltipClassName = "",
  arrowClassName = "",
}) => {
  if (!isVisible) return null;

  const arrowPosition = bubblePosition.x - position.x;

  return createPortal(
    <div
      className={`pointer-events-none fixed z-[999999] max-w-xs whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-2xl ${tooltipClassName}`}
      style={{
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
        zIndex: 999999,
      }}
    >
      {content}
      <div
        className={`absolute h-0 w-0 border-b-4 border-l-4 border-r-4 border-transparent border-b-gray-900 ${arrowClassName}`}
        style={{
          left: `50%`,
          marginLeft: `${arrowPosition}px`,
          top: "-4px",
          transform: "translateX(-50%)",
        }}
      ></div>
    </div>,
    document.body,
  );
};

// Main MouseFollowTooltip Component
const MouseFollowTooltip = ({
  children,
  content,
  disabled = false,
  className = "inline-block",
  tooltipClassName = "",
  arrowClassName = "",
  offset = 10,
  hideArrow = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [triggerPosition, setTriggerPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (disabled) return;

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setTriggerPosition({
        x: rect.left + scrollX + rect.width / 2,
        y: rect.top + scrollY + rect.height / 2,
      });

      setTooltipPosition({
        x: rect.left + scrollX + rect.width / 2,
        y: rect.bottom + scrollY + offset,
      });

      setShowTooltip(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!showTooltip || disabled || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    setTooltipPosition({
      x: e.clientX + scrollX,
      y: rect.bottom + scrollY + offset,
    });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      <PortalTooltip
        isVisible={showTooltip}
        position={tooltipPosition}
        bubblePosition={triggerPosition}
        content={content}
        tooltipClassName={tooltipClassName}
        arrowClassName={arrowClassName}
      />
    </>
  );
};

export default MouseFollowTooltip;
