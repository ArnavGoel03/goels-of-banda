CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"person_slugs" text[],
	"place_slugs" text[],
	"told_by" text,
	"told_by_slug" text,
	"tags" text[],
	"photo_key" text,
	"audio_key" text,
	"audio_transcript" text,
	"notes" text,
	"submitted_by" text NOT NULL,
	"submitted_by_email" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"body" text NOT NULL,
	"occurred_on" text,
	"occurred_year" integer,
	"occurred_month" integer,
	"occurred_day" integer,
	"occurred_circa" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"person_slugs" text[],
	"place_slugs" text[],
	"told_by" text,
	"told_by_slug" text,
	"tags" text[],
	"photo_key" text,
	"audio_key" text,
	"audio_transcript" text,
	"notes" text,
	"submitted_by" text NOT NULL,
	"submitted_by_email" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"summary" text,
	"ingredients" text NOT NULL,
	"steps" text NOT NULL,
	"occasion" text
);
--> statement-breakpoint
CREATE TABLE "traditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"person_slugs" text[],
	"place_slugs" text[],
	"told_by" text,
	"told_by_slug" text,
	"tags" text[],
	"photo_key" text,
	"audio_key" text,
	"audio_transcript" text,
	"notes" text,
	"submitted_by" text NOT NULL,
	"submitted_by_email" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"kind" text DEFAULT 'custom' NOT NULL,
	"summary" text,
	"body" text NOT NULL,
	"occasion" text
);
--> statement-breakpoint
CREATE INDEX "memories_status_idx" ON "memories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "memories_year_idx" ON "memories" USING btree ("occurred_year");--> statement-breakpoint
CREATE UNIQUE INDEX "memories_slug_idx" ON "memories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "recipes_status_idx" ON "recipes" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "recipes_slug_idx" ON "recipes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "traditions_status_idx" ON "traditions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "traditions_slug_idx" ON "traditions" USING btree ("slug");