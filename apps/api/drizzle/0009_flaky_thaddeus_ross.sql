CREATE TABLE "user_washing_station" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"washing_station_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_washing_station" ADD CONSTRAINT "user_washing_station_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_washing_station" ADD CONSTRAINT "user_washing_station_washing_station_id_washing_station_id_fk" FOREIGN KEY ("washing_station_id") REFERENCES "public"."washing_station"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "user_washing_station" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "washing_station_id_idx" ON "user_washing_station" USING btree ("washing_station_id");