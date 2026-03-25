import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router"
import NotFound from "./pages/not-found"
import RootLayout from "./layouts/root-layout"
import ErrorPage from "./pages/error-page"
import SyncMonitor from "./pages/sync-monitor"
import Overview from "./pages/overview"

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Overview,
  errorComponent: ErrorPage,
})

const syncMonitorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sync-monitor",
  component: SyncMonitor,
  errorComponent: ErrorPage,
})

const routeTree = rootRoute.addChildren([overviewRoute, syncMonitorRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export { syncMonitorRoute }
