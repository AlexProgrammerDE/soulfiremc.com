import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RootComponent() {
  return (
    <article className="w-full overflow-x-hidden break-words nextra-content flex min-h-[calc(100vh-var(--nextra-navbar-height))] min-w-0 justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]">
      <main className="flex w-full my-auto">
        <div className="flex flex-col m-auto gap-4">
          <h1 className="text-3xl font-bold text-center">
            404 - Page not found
          </h1>
          <div className="mx-4">
            <Image
              src="/nyan-cat.webp"
              alt="Nyan Cat"
              width={500}
              height={500}
              className="rounded-xl"
            />
          </div>
          <Button asChild>
            <Link href="/" className="w-fit m-auto">
              <span>Go back</span>
            </Link>
          </Button>
        </div>
      </main>
    </article>
  );
}
