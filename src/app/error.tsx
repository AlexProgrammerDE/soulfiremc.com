"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto flex my-auto">
      <div className="flex flex-col m-auto gap-4">
        <h1 className="text-3xl font-bold text-center">
          Something went wrong
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} className="w-fit m-auto">
          Try again
        </Button>
      </div>
    </main>
  );
}
