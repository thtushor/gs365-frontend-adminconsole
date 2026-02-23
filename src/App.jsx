import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import ComingSoon from "./components/ComingSoon";
import {
  affiliateOutsideRoute,
  gameProviderOutsideRoute,
  menu,
  sportProviderOutsideRoute,
} from "./Utils/menu.jsx";
import AffiliateLayout from "./components/AffiliateLayout";
import GameProviderLayout from "./components/GameProviderLayout.jsx";
import SportsProviderLayout from "./components/SportProviderInner/SportsProviderLayout.jsx";
import { use, useEffect } from "react";
import { useAuth } from "./hooks/useAuth.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider
import {
  checkHasCategoryPermission,
  getPermissionsByCategory,
  hasPermission,
} from "./Utils/permissions.js";
import { staticAffiliatePermission } from "./Utils/staticAffiliatePermission.js";
import UnAuthorized from "./components/UnAuthorizedAccess.jsx";
import Loader from "./components/Loader.jsx"; // Import the Loader component
import ServerError from "./components/shared/ServerError.jsx";

// Handle normal menu routes (inside Layout)

function getRoutes(menu, user) {
  const permissions = user?.designation?.permissions || [];
  const isSuperAdmin = user?.role === "superAdmin";

  const routes = [];
  for (const item of menu) {
    const Component = item.component;
    const hasCategoryPermission = item.accessCategory
      ? checkHasCategoryPermission(permissions, item.accessCategory)
      : false;
    const skipPermissionUsers = item.skipPermissionUsers || [];

    const hasSkipPermissionUser = skipPermissionUsers.includes(user?.role);

    const isAuthorized = isSuperAdmin || hasSkipPermissionUser || hasCategoryPermission;

    if (item.path)
      routes.push(
        <Route
          key={item.path}
          path={item.path.replace(/^\//, "")}
          element={
            isAuthorized ? (
              Component ? (
                <Component {...item.props} />
              ) : (
                <ComingSoon title={item.label} />
              )
            ) : (
              <UnAuthorized />
            )
          }
        />
      );

    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        const ChildComponent = child.component;


        const skipPermissionUsers = child.skipPermissionUsers || [];
        const hasSkipPermissionUser = skipPermissionUsers.includes(user?.role);

        const childHasPermission =
          isSuperAdmin || hasSkipPermissionUser ||
          hasPermission(permissions, child.accessKey);

        if (child.path)
          routes.push(
            <Route
              key={child.path}
              path={child.path.replace(/^\//, "")}
              element={
                childHasPermission ? (
                  ChildComponent ? (
                    <ChildComponent {...child.props} />
                  ) : (
                    <ComingSoon title={child.label} />
                  )
                ) : (
                  <UnAuthorized />
                )
              }
            />
          );
      }
    }
  }
  return routes;
}

// Handle routes that don't use Layout
function getOutsideRoutes(routes, LayoutWrapper = null, user, isAffiliate = false) {
  const permissions = user?.designation?.permissions || [];
  const isSuperAdmin =
    user?.role === "superAdmin";

  return routes.map((route) => {
    const Component = route.component;
    const hasCategoryPermission = route.accessKey
      ? hasPermission(permissions, route.accessKey)
      : false;

    let isAuthorized;
    if (isAffiliate) {
      isAuthorized = staticAffiliatePermission(user?.role, permissions, route.accessKey);
    } else {
      isAuthorized = isSuperAdmin || hasCategoryPermission;
    }

    const RouteElement = isAuthorized ? (
      <Component {...route.props} />
    ) : (
      <UnAuthorized
        titleClassName="text-green-500"
        subTittleClassName={"text-white"}
      />
    );

    return LayoutWrapper ? (
      <Route
        key={route.path}
        path={route.path.replace(/^\//, "")}
        element={<LayoutWrapper />}
      >
        <Route index element={RouteElement} />
      </Route>
    ) : (
      <Route
        key={route.path}
        path={route.path.replace(/^\//, "")}
        element={RouteElement}
      />
    );
  });
}

const queryClient = new QueryClient(); // Create a client

function App() {
  const { user, isValidating } = useAuth(); // Get isValidating from useAuth
  const location = useLocation();

  console.log({ location: location?.pathname })


  if (isValidating && !location?.pathname?.includes("server-error")) {
    return <Loader />; // Show loader while validating
  }

  return (
    <QueryClientProvider client={queryClient}> {/* Wrap the application with QueryClientProvider */}
      <Routes>
        {/* Routes inside the layout */}
        <Route path="/" element={<Layout />}>
          {getRoutes(menu, user)}
          {getOutsideRoutes(affiliateOutsideRoute, AffiliateLayout, user, true)}
          {getOutsideRoutes(gameProviderOutsideRoute, GameProviderLayout, user)}
          {getOutsideRoutes(
            sportProviderOutsideRoute,
            SportsProviderLayout,
            user
          )}
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
