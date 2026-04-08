"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";

export function SignInRequiredCredenza({
  open,
  onOpenChange,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="sm:max-w-md">
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription>{description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Sign in to your account to submit ratings and reviews.
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </CredenzaClose>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
              const target = `/auth/sign-in?redirectTo=${encodeURIComponent(currentPath)}`;
              router.push(target);
            }}
          >
            Sign In
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
