import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking overlay or navigating
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  console.log(user);
  const isAdmin = user?.role === "admin";
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar for desktop, drawer for mobile */}
      {/* <Sidebar open={sidebarOpen} onClose={closeSidebar} /> */}
      {isAdmin && <Sidebar open={sidebarOpen} onClose={closeSidebar} />}
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
          className="flex  flex-col p-2 min-h-[94vh] md:p-6 overflow-y-auto bg-[#f5f5f5]"
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
