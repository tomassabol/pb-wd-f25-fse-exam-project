CREATE TABLE "membership" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" bigint NOT NULL,
	"originalPrice" bigint NOT NULL,
	"currency" text NOT NULL,
	"period" text NOT NULL,
	"features" text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
