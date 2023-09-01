import "dotenv/config";

import postgres from "postgres";
import { createConnection as createConnectionMysql2 } from "mysql2/promise";
import { connect as planetscaleConnect } from "@planetscale/database";

import { postgresjs } from "./drivers/postgresjs.ts";
import { mysql2 } from "./drivers/mysql2.ts";
import { planetscaleServerless } from "./drivers/planetscale-serverless.ts";
import { run } from "./run.ts";

async function init() {
  const runtime = "node" as const;

  const planetscaleMysqlUrl = process.env.PLANETSCALE_URL;
  if (!planetscaleMysqlUrl) {
    throw new Error("Missing PLANETSCALE_URL");
  }

  const supabasePostgresUrl = process.env.SUPABASE_URL;
  if (!supabasePostgresUrl) {
    throw new Error("Missing SUPABASE_URL");
  }

  const neonPostgresUrl = process.env.NEON_URL;
  if (!neonPostgresUrl) {
    throw new Error("Missing NEON_URL");
  }

  const postgresjsDriverUsingNeon = await postgresjs({
    runtime,
    databaseProvider: "postgres_neon",
    driver: postgres,
    databaseUrl: neonPostgresUrl,
  });

  const postgresjsDriverUsingSupabase = await postgresjs({
    runtime,
    databaseProvider: "postgres_supabase",
    driver: postgres,
    databaseUrl: neonPostgresUrl,
  });

  const mysql2Driver = await mysql2(
    {
      runtime,
      databaseProvider: "mysql_planetscale",
      driver: createConnectionMysql2,
      databaseUrl: planetscaleMysqlUrl,
    },
  );

  const planetscaleServerlessDriver = await planetscaleServerless(
    {
      runtime,
      databaseProvider: "mysql_planetscale",
      driver: planetscaleConnect,
      databaseUrl: planetscaleMysqlUrl,
    },
  );

  await run([
    postgresjsDriverUsingNeon,
    postgresjsDriverUsingSupabase,
    mysql2Driver,
    planetscaleServerlessDriver,
  ]);
}

init();
