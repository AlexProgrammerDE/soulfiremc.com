import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/demo-video")({
  beforeLoad: () => {
    throw redirect({
      href: "https://www.youtube.com/watch?v=BD-xE8vbHtQ",
    });
  },
});
