import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "../src/env";
import * as schema from "./schema";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema, casing: "snake_case" });
