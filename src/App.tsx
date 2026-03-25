import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router"
import NotFound from "./pages/not-found"
import RootLayout from "./layouts/root-layout"
import AuthLayout from "./layouts/auth-layout"
import AppLayout from "./layouts/app-layout"

import ErrorPage from "./pages/error-page"
import SyncMonitor from "./pages/sync-monitor"
import Overview from "./pages/overview"
import LoginPage from "./pages/login"

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppLayout,
})

const overviewRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: Overview,
  errorComponent: ErrorPage,
})

const syncMonitorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/sync-monitor",
  component: SyncMonitor,
  errorComponent: ErrorPage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth",
  component: AuthLayout,
})

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "login",
  component: LoginPage,
  errorComponent: ErrorPage,
})

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute]),
  appRoute.addChildren([overviewRoute, syncMonitorRoute]),
])

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
