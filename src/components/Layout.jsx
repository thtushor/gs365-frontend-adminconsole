import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { staticAffiliatePermission } from "../Utils/staticAffiliatePermission";

const Layout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking overlay or navigating
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  const isAdmin = staticAffiliatePermission(user.role);

  const userType = import.meta.env.VITE_USER_TYPE;

  const documentTitle = () => {
    if (userType === "affiliate") {
      document.title = "GS AFFILIATE";

      // Change favicon
      const link =
        document.querySelector("link[rel~='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = "/affiliate-favicon.png";
      document.head.appendChild(link);
    } else {
      document.title = "GS ADMIN";

      // Change favicon
      const link =
        document.querySelector("link[rel~='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = "/admin-favicon.png";
      document.head.appendChild(link);
    }
  };
  useEffect(() => {
    // Dynamically set title
    documentTitle;
  }, [userType]);

  documentTitle();
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
