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
import UserManagement from "./pages/user-management"
import ForgotPasswordPage from "./pages/forgot-password"
import UpdatePasswordPage from "./pages/update-password"
import ManualDTRUpload from "./pages/manual-dtr-upload"

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
        path: "auth/forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "auth/update-password",
        Component: UpdatePasswordPage,
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
                // ErrorBoundary: Error,
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
              {
                path: "user-management",
                Component: UserManagement,
                ErrorBoundary: Error,
              },
            ],
          },
        ],
      },
      {
        path: "/manual-dtr-upload",
        Component: ManualDTRUpload,
      },
    ],
  },
])
