ALTER TABLE "wash_type" RENAME COLUMN "features" TO "included_features";--> statement-breakpoint
ALTER TABLE "wash_type" ADD COLUMN "excluded_features" text[] DEFAULT '{}' NOT NULL;