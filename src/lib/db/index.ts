import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as generatedAuthSchema from "./auth-schema";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL ?? "");
export const db = drizzle(sql, {
  schema: {
    ...generatedAuthSchema,
    ...schema,
  },
});
