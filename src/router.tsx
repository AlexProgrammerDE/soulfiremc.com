import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, deepEqual } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount) => failureCount < 3,
      structuralSharing: (previous, next) =>
        deepEqual(previous, next) ? previous : next,
    },
  },
});

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    scrollRestorationBehavior: "auto",
    defaultStructuralSharing: true,
    context: {
      queryClient,
    },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}
