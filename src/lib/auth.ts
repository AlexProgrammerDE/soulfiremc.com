import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  captcha,
  haveIBeenPwned,
  twoFactor,
  username,
} from "better-auth/plugins";
import { db } from "@/lib/db";
import * as generatedAuthSchema from "@/lib/db/auth-schema";
import * as schema from "@/lib/db/schema";
import {nextCookies} from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      ...generatedAuthSchema,
    },
  }),
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
  plugins: [
    username(),
    admin(),
    twoFactor(),
    haveIBeenPwned(),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.TURNSTILE_SECRET_KEY ?? "",
    }),
    nextCookies()
  ],
  trustedOrigins: ["https://soulfiremc.com"],
});
