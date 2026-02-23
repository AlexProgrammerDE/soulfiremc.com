import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  captcha,
  emailOTP,
  haveIBeenPwned,
  jwt,
  lastLoginMethod,
  twoFactor,
  username,
} from "better-auth/plugins";
import { emailHarmony } from "better-auth-harmony";
import { db } from "@/lib/db";
import * as generatedAuthSchema from "@/lib/db/auth-schema";
import * as schema from "@/lib/db/schema";
import { authNotifications } from "./auth-notifications";

export const auth = betterAuth({
  appName: "SoulFire",
  baseURL: "https://soulfiremc.com",
  secret: process.env.BETTER_AUTH_SECRET ?? "",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      ...generatedAuthSchema,
    },
  }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }): Promise<void> {
      await authNotifications.sendPasswordReset({ user, url });
    },
    autoSignIn: true,
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }): Promise<void> {
      await authNotifications.sendEmailVerification({ user, url });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url }): Promise<void> {
        await authNotifications.sendChangeEmailVerification({ user, url });
      },
    },
    deleteUser: {
      enabled: true,
      async sendDeleteAccountVerification({ user, url }): Promise<void> {
        await authNotifications.sendDeleteAccountVerification({ user, url });
      },
    },
  },
  plugins: [
    emailHarmony(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }): Promise<void> {
          await authNotifications.sendTwoFactorOTP({ user, otp });
        },
      },
    }),
    username(),
    emailOTP({
      sendVerificationOnSignUp: false,
      async sendVerificationOTP({ email, otp, type }): Promise<void> {
        await authNotifications.sendEmailOTP({ email, otp, type });
      },
    }),
    passkey(),
    admin(),
    jwt(),
    lastLoginMethod(),
    haveIBeenPwned({
      customPasswordCompromisedMessage: "Please choose a more secure password.",
    }),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
    }),
    nextCookies(),
  ],
  trustedOrigins: ["https://soulfiremc.com"],
});
