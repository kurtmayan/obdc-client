import { createBrowserRouter } from "react-router"
import AuthLayout from "./layouts/auth-layout"
import LoginPage from "./pages/login"
import AppLayout from "./layouts/app-layout"
import Overview from "./pages/overview"
import SyncMonitor from "./pages/sync-monitor"
import RootLayout from "./layouts/root-layout"
import Error from "./components/error"
import ProtectedRoute from "./components/protected-route"
import SyncMonitorLocation from "./pages/sync-monitor/[location]"

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
        path: "",
        // Component: ProtectedRoute,
        children: [
          {
            Component: AppLayout,
            children: [
              {
                path: "",
                Component: Overview,
                ErrorBoundary: Error,
              },
              {
                path: "sync-monitor",
                Component: SyncMonitor,
                ErrorBoundary: Error,
              },
              {
                path: "sync-monitor/:id",
                Component: SyncMonitorLocation,
                ErrorBoundary: Error,
              },
            ],
          },
        ],
      },
    ],
  },
])
