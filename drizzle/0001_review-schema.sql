CREATE TABLE "review_item_owner" (
	"item_type" text NOT NULL,
	"item_slug" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_item_owner_item_type_item_slug_user_id_pk" PRIMARY KEY("item_type","item_slug","user_id")
);
--> statement-breakpoint
CREATE TABLE "review_reply" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "upvote" RENAME TO "review";--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "upvote_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "upvote_item_idx";--> statement-breakpoint
ALTER TABLE "review" DROP CONSTRAINT "upvote_user_id_item_type_item_slug_pk";--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "anonymous" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "rating" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "body" text;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "review_item_owner" ADD CONSTRAINT "review_item_owner_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reply" ADD CONSTRAINT "review_reply_review_id_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_reply" ADD CONSTRAINT "review_reply_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "review_item_owner_user_idx" ON "review_item_owner" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_reply_review_unique" ON "review_reply" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "review_reply_user_idx" ON "review_reply" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "review_user_item_unique" ON "review" USING btree ("user_id","item_type","item_slug");--> statement-breakpoint
CREATE INDEX "review_item_idx" ON "review" USING btree ("item_type","item_slug");--> statement-breakpoint
CREATE INDEX "review_item_created_idx" ON "review" USING btree ("item_type","item_slug","created_at");--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_rating_range" CHECK ("review"."rating" >= 1 AND "review"."rating" <= 5);