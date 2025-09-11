import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import {
  checkHasCategoryPermission,
  getPermissionsByCategory,
  hasPermission,
} from "./Utils/permissions.js";
import UnAuthorized from "./components/UnAuthorizedAccess.jsx";
import Loader from "./components/Loader.jsx"; // Import the Loader component

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

    const isAuthorized = isSuperAdmin || hasCategoryPermission;

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
        const childHasPermission =
          isSuperAdmin ||
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
function getOutsideRoutes(routes, LayoutWrapper = null, user) {
  const permissions = user?.designation?.permissions || [];
  const isSuperAdmin = user?.role === "superAdmin";

  return routes.map((route) => {
    const Component = route.component;
    const hasCategoryPermission = route.accessKey
      ? hasPermission(permissions, route.accessKey)
      : false;

    const isAuthorized = isSuperAdmin || hasCategoryPermission;
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

function App() {
  const { user, isValidating } = useAuth(); // Get isValidating from useAuth
  const userType = import.meta.env.VITE_USER_TYPE;

  useEffect(() => {
    // Dynamically set title
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
      link.href = "/admin-favicon.png"; // your admin favicon path
      document.head.appendChild(link);
    }
  }, [userType]);

  if (isValidating) {
    return <Loader />; // Show loader while validating
  }

  return (
    <Routes>
      {/* Routes inside the layout */}
      <Route path="/" element={<Layout />}>
        {getRoutes(menu, user)}
        {getOutsideRoutes(affiliateOutsideRoute, AffiliateLayout, user)}
        {getOutsideRoutes(gameProviderOutsideRoute, GameProviderLayout, user)}
        {getOutsideRoutes(
          sportProviderOutsideRoute,
          SportsProviderLayout,
          user
        )}
      </Route>
    </Routes>
  );
}

export default App;
