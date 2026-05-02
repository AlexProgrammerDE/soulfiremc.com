CREATE TYPE "public"."review_comment_status" AS ENUM('approved', 'pending', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."review_item_type" AS ENUM('account', 'proxy', 'resource');--> statement-breakpoint
ALTER TABLE "review" ALTER COLUMN "item_type" SET DATA TYPE "public"."review_item_type" USING "item_type"::"public"."review_item_type";--> statement-breakpoint
ALTER TABLE "review_item_owner" ALTER COLUMN "item_type" SET DATA TYPE "public"."review_item_type" USING "item_type"::"public"."review_item_type";--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "comment_status" "review_comment_status";--> statement-breakpoint
CREATE INDEX "review_comment_status_idx" ON "review" USING btree ("comment_status");