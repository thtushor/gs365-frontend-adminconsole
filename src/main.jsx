/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import App from "./App";
import Login from "./components/Login";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUploadTestPage from "./components/test/ImageUploadTestPage";
import ServerError from "./components/shared/ServerError";

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { user, isValidating } = useAuth();

  const pathname = useLocation().pathname;

  const navigate = useNavigate();
  // console.log({ isValidating, user });

  useEffect(() => {
    if (user) {
      if (
        (user?.role === "affiliate" || user?.role === "superAffiliate") &&
        !pathname.includes(`/affiliate-list/`) &&
        !pathname.includes("/create-affiliate")
      ) {
        navigate(`/affiliate-list/${user?.id}`, {
          replace: true,
        });
      }
    }
  }, [user, navigate]);

  if (!user && !isValidating) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </>
  );
}

function Router() {
  const { user, isProfileLoading } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/server-error" element={<ServerError />} />

      <Route path="/test/image-upload" element={<ImageUploadTestPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
