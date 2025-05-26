CREATE TABLE "user_membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"membership_id" text,
	"license_plate" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_membership" ADD CONSTRAINT "user_membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_membership" ADD CONSTRAINT "user_membership_membership_id_membership_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expires_at_index" ON "user_membership" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "user_id_index" ON "user_membership" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "membership_id_index" ON "user_membership" USING btree ("membership_id");