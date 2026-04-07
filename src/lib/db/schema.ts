import {
  index,
  pgTable,
  // biome-ignore lint/suspicious/noDeprecatedImports: Drizzle marks the legacy overload on this symbol as deprecated, but the object form used below is the current API.
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "@/lib/db/auth-schema";

export const upvote = pgTable(
  "upvote",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemType: text("item_type", {
      enum: ["account", "proxy", "resource"],
    }).notNull(),
    itemSlug: text("item_slug").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.itemType, table.itemSlug] }),
    index("upvote_item_idx").on(table.itemType, table.itemSlug),
  ],
);
