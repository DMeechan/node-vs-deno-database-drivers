import "https://deno.land/std@0.198.0/dotenv/load.ts";

// Need to use a fork because "https://deno.land/x/mysql/mod.ts" doesn't support TLS yet.
// Waiting for https://github.com/denodrivers/mysql/pull/154 to be merged.
import { Client } from "https://raw.githubusercontent.com/shiyuhang0/mysql/tls/mod.ts";
import { connect } from "npm:@planetscale/database@1.10.0";

import { planetscaleServerless } from "./drivers/planetscale-serverless.ts";
import { denoMysql } from "./drivers/deno_mysql.ts";
import { run } from "./run.ts";

// import { createConnection } from "npm:mysql2@^3.6.0/promise";
// import { mysql2 } from "./drivers/mysql2.ts";

async function init() {
  const runtime = "deno" as const;
  const planetscaleMysqlUrl = Deno.env.get("PLANETSCALE_URL")!;
  if (!planetscaleMysqlUrl) {
    throw new Error("Missing PLANETSCALE_URL");
  }

  const denoMysqlDriver = await denoMysql({
    runtime,
    driver: Client,
    databaseUrl: planetscaleMysqlUrl,
  });

  const planetscaleServerlessDriver = await planetscaleServerless(
    { runtime, driver: connect, databaseUrl: planetscaleMysqlUrl },
  );

  // The mysql2 driver does not currently run on Deno with TLS enabled - see README for more info
  // const mysql2Driver = await mysql2(
  //   { runtime, driver: createConnection, databaseUrl: planetscaleMysqlUrl },
  // );

  await run([denoMysqlDriver, planetscaleServerlessDriver]);
}

await init();
