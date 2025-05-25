CREATE TABLE "washing_station" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text[] NOT NULL,
	"address" text NOT NULL,
	"coordinate" json NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"distance" real DEFAULT 0 NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"open_hours" text NOT NULL,
	"average_wait_time" integer DEFAULT 0 NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"image_url" text,
	"phone" text,
	"description" text,
	"services" text[] DEFAULT '{}' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
