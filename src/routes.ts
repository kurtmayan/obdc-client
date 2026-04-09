import { createBrowserRouter } from "react-router"
import AuthLayout from "./layouts/auth-layout"
import LoginPage from "./pages/login"
import AppLayout from "./layouts/app-layout"
import SyncMonitor from "./pages/sync-monitor"
import RootLayout from "./layouts/root-layout"
import Error from "./components/error"
import ProtectedRoute from "./components/protected-route"
import SyncMonitorStoreView from "./pages/sync-monitor/[storeId]"
import Dashboard from "./pages/dashboard"
import SyncMonitorDetailedView from "./pages/sync-monitor/[storeId]/[detailedId]"
import TwoFactorAuthenticationPage from "./pages/2fa"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            index: true,
            path: "login",
            Component: LoginPage,
          },
        ],
      },
      {
        path: "auth/2fa",
        Component: TwoFactorAuthenticationPage,
      },
      {
        path: "",
        Component: ProtectedRoute,
        children: [
          {
            Component: AppLayout,
            children: [
              {
                path: "",
                Component: Dashboard,
                ErrorBoundary: Error,
              },
              {
                path: "sync-monitor",
                Component: SyncMonitor,
                ErrorBoundary: Error,
              },
              {
                path: "sync-monitor/:storeId",
                Component: SyncMonitorStoreView,
                ErrorBoundary: Error,
              },
              {
                path: "sync-monitor/:storeId/:detailedId",
                Component: SyncMonitorDetailedView,
                ErrorBoundary: Error,
              },
            ],
          },
        ],
      },
    ],
  },
])
