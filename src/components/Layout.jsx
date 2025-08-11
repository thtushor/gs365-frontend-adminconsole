import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking overlay or navigating
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar for desktop, drawer for mobile */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20  z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden  pb-10">
        <Topbar onMenuClick={openSidebar} />
        <main
          id="layout-scroll"
          className="flex  flex-col p-2 md:p-6 overflow-y-auto bg-[#f5f5f5]"
        >
          <div className="pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
