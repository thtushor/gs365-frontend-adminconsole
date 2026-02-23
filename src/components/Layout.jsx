import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { staticAdminCheck, staticAffiliatePermission } from "../Utils/staticAffiliatePermission";
import { useSocket } from "../socket";
import { useQueryClient } from "@tanstack/react-query";

const Layout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const queryClient = useQueryClient();

  const { socket } = useSocket(); // Initialize socket without chatId

  // Close sidebar when clicking overlay or navigating
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  const isAdmin = staticAdminCheck(user?.role);


  useEffect(() => {
    socket?.on(`newMessage`, (data) => {
      console.log("New message found 2", data)
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", {
          ...user
        }]
      });
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chats-count"] })
    })

    return () => {
      socket?.removeListener(`newMessage`)
    }
  }, [socket])

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
