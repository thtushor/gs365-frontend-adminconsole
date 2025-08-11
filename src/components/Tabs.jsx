import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabVariants = {
  active: { color: "#16a34a" },
  inactive: { color: "#64748b" },
};

const underlineVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "100%", opacity: 1, transition: { duration: 0.3 } },
  exit: { width: 0, opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const Tabs = ({ tabs, value, onChange, children }) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 border-b border-gray-200 mb-4 relative bg-white rounded-t-lg overflow-x-auto">
        {tabs.map((tab, idx) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              className={`relative px-5 py-2 font-semibold transition focus:outline-none flex items-center gap-2 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
              style={{
                background: isActive ? "#f0fdf4" : "transparent",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              onClick={() => onChange(tab.value)}
            >
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <motion.span
                animate={isActive ? "active" : "inactive"}
                variants={tabVariants}
              >
                {tab.label}
              </motion.span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 h-1 bg-green-500 rounded-t"
                    variants={underlineVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
      <div className="relative min-h-[120px]">
        <AnimatePresence mode="wait" initial={false}>
          {React.Children.map(children, (child, idx) => {
            if (!child) return null;
            return (
              value === tabs[idx].value && (
                <motion.div
                  key={tabs[idx].value}
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  {child}
                </motion.div>
              )
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
