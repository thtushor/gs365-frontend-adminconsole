import { Link, useLocation } from "react-router-dom";

import { motion } from "framer-motion";
import { menu } from "../Utils/menu.jsx";

const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
  closed: {
    x: -300,
    opacity: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

function getCurrentPathName(pathname) {
  if (pathname === "/") return "Dashboard";
  for (const item of menu) {
    if (item.path === pathname) return item.label;
    if (item.children) {
      for (const child of item.children) {
        if (child.path === pathname) return child.label;
      }
    }
  }
  return "";
}

const Sidebar = ({ open = false, onClose = () => {} }) => {
  const location = useLocation();
  const currentPathName = getCurrentPathName(location.pathname);
  return (
    <>
      {/* Mobile Drawer Sidebar */}
      <motion.aside
        className="bg-[#07122b] text-white w-64 min-w-[220px] h-full flex flex-col py-4 px-2 z-40 fixed md:hidden overflow-y-auto"
        initial={false}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        style={{ left: 0, top: 0, bottom: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1 px-4 mb-8">
          <span className="text-2xl font-bold">
            GS <span className="text-[#3ecf8e]">365</span>
          </span>
          <span className="text-xs text-gray-400 mt-1 tracking-wide">
            {currentPathName}
          </span>
        </div>
        <nav className="flex-1">
          {menu.map((item, idx) =>
            item?.skipFromMenu ? null : (
              <div key={idx} className="mb-2">
                <Link
                  to={item.path || "#"}
                  className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-[#1a2a4a] text-[#3ecf8e] font-semibold"
                      : "hover:bg-[#1a2a4a] hover:text-[#3ecf8e]"
                  }`}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                </Link>

                {item.children && (
                  <div className="ml-6 mt-1">
                    {item.children.map((child, cidx) =>
                      child?.skipFromMenu ? null : (
                        <Link
                          key={cidx}
                          to={child.path}
                          className={`flex items-center gap-2 px-4 py-1 rounded cursor-pointer text-sm transition-colors duration-200 ${
                            location.pathname === child.path
                              ? "bg-[#1a2a4a] text-[#3ecf8e] font-semibold"
                              : "hover:bg-[#1a2a4a] hover:text-[#3ecf8e]"
                          }`}
                          onClick={onClose}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
      </motion.aside>
      {/* Desktop Static Sidebar */}
      <aside className="bg-[#07122b] text-white w-64 min-w-[220px] h-full flex flex-col py-4 px-2 z-10 hidden md:flex overflow-y-auto fixed md:static">
        <div className="flex flex-col gap-1 px-4 mb-8">
          <span className="text-2xl font-bold">
            GS <span className="text-[#3ecf8e]">365</span>
          </span>
          <span className="text-xs text-gray-400 mt-1 tracking-wide">
            {currentPathName}
          </span>
        </div>
        <nav className="flex-1">
          {menu.map((item, idx) =>
            item?.skipFromMenu ? null : (
              <div key={idx} className="mb-2">
                <Link
                  to={item.path || "#"}
                  className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-[#1a2a4a] text-[#3ecf8e] font-semibold"
                      : "hover:bg-[#1a2a4a] hover:text-[#3ecf8e]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>

                {item.children && (
                  <div className="ml-6 mt-1">
                    {item.children.map((child, cidx) =>
                      child?.skipFromMenu ? null : (
                        <Link
                          key={cidx}
                          to={child.path}
                          className={`flex items-center gap-2 px-4 py-1 rounded cursor-pointer text-sm transition-colors duration-200 ${
                            location.pathname === child.path
                              ? "bg-[#1a2a4a] text-[#3ecf8e] font-semibold"
                              : "hover:bg-[#1a2a4a] hover:text-[#3ecf8e]"
                          }`}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
