import "https://deno.land/std@0.198.0/dotenv/load.ts";

import postgres from "postgresjs";
import { Client } from "deno_mysql";
import { connect } from "@planetscale/database";

import { postgresjs } from "./drivers/postgresjs.ts";
import { denoMysql } from "./drivers/deno_mysql.ts";
import { planetscaleServerless } from "./drivers/planetscale-serverless.ts";

import { run } from "./run.ts";

async function init() {
  const runtime = "deno" as const;
  const planetscaleMysqlUrl = Deno.env.get("PLANETSCALE_URL")!;
  if (!planetscaleMysqlUrl) {
    throw new Error("Missing PLANETSCALE_URL");
  }

  const supabasePostgresUrl = Deno.env.get("SUPABASE_URL")!;
  if (!supabasePostgresUrl) {
    throw new Error("Missing SUPABASE_URL");
  }

  const neonPostgresUrl = Deno.env.get("NEON_URL")!;
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

  const denoMysqlDriver = await denoMysql({
    runtime,
    databaseProvider: "mysql_planetscale",
    driver: Client,
    databaseUrl: planetscaleMysqlUrl,
  });

  const planetscaleServerlessDriver = await planetscaleServerless(
    {
      runtime,
      databaseProvider: "mysql_planetscale",
      driver: connect,
      databaseUrl: planetscaleMysqlUrl,
    },
  );

  await run([
    postgresjsDriverUsingNeon,
    postgresjsDriverUsingSupabase,
    denoMysqlDriver,
    planetscaleServerlessDriver,
  ]);
}

await init();
