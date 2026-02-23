import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

const clientOptions = {
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    usernameClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient(),
    lastLoginMethodClient(),
  ],
};

export const authClient = createAuthClient(clientOptions);
