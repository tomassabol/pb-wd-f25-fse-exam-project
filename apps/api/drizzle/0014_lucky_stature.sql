CREATE TABLE "car_wash" (
	"id" text PRIMARY KEY NOT NULL,
	"license_plate" text NOT NULL,
	"washing_station_id" text NOT NULL,
	"wash_type_id" text NOT NULL,
	"user_id" text,
	"payment_method" text NOT NULL,
	"amount" bigint NOT NULL,
	"currency" text NOT NULL,
	"membership_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "user_id_idx";--> statement-breakpoint
DROP INDEX "washing_station_id_idx";--> statement-breakpoint
ALTER TABLE "car_wash" ADD CONSTRAINT "car_wash_washing_station_id_washing_station_id_fk" FOREIGN KEY ("washing_station_id") REFERENCES "public"."washing_station"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_wash" ADD CONSTRAINT "car_wash_wash_type_id_wash_type_id_fk" FOREIGN KEY ("wash_type_id") REFERENCES "public"."wash_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_wash" ADD CONSTRAINT "car_wash_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_wash" ADD CONSTRAINT "car_wash_membership_id_membership_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "car_wash_wash_type_id_idx" ON "car_wash" USING btree ("wash_type_id");--> statement-breakpoint
CREATE INDEX "car_wash_washing_station_id_idx" ON "car_wash" USING btree ("washing_station_id");--> statement-breakpoint
CREATE INDEX "car_wash_user_id_idx" ON "car_wash" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "car_wash_license_plate_idx" ON "car_wash" USING btree ("license_plate");--> statement-breakpoint
CREATE INDEX "user_washing_station_user_id_idx" ON "user_washing_station" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_washing_station_washing_station_id_idx" ON "user_washing_station" USING btree ("washing_station_id");