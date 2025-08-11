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

// Handle normal menu routes (inside Layout)
function getRoutes(menu) {
  const routes = [];
  for (const item of menu) {
    const Component = item.component;
    if (item.path) {
      routes.push(
        <Route
          key={item.path}
          path={item.path.replace(/^\//, "")}
          element={
            Component ? (
              <Component {...item.props} />
            ) : (
              <ComingSoon title={item.label} />
            )
          }
        />
      );
    }
    if (item.children) {
      for (const child of item.children) {
        const ChildComponent = child.component;
        routes.push(
          <Route
            key={child.path}
            path={child.path.replace(/^\//, "")}
            element={
              ChildComponent ? (
                <ChildComponent {...child.props} />
              ) : (
                <ComingSoon title={child.label} />
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
function getOutsideRoutes(routes, LayoutWrapper = null) {
  return routes.map((route) => {
    const Component = route.component;
    const RouteElement = <Component {...route.props} />;

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
  return (
    <Routes>
      {/* Routes inside the layout */}
      <Route path="/" element={<Layout />}>
        {getRoutes(menu)}
        {getOutsideRoutes(affiliateOutsideRoute, AffiliateLayout)}
        {getOutsideRoutes(gameProviderOutsideRoute, GameProviderLayout)}
        {getOutsideRoutes(sportProviderOutsideRoute, SportsProviderLayout)}
      </Route>
    </Routes>
  );
}

export default App;
