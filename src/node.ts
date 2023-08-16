import "dotenv/config";

import { connect } from "@planetscale/database";
import { createConnection } from "mysql2/promise";

import { mysql2 } from "./drivers/mysql2.ts";
import { planetscaleServerless } from "./drivers/planetscale-serverless.ts";
import { run } from "./run.ts";

async function init() {
  const runtime = "node" as const;

  const planetscaleMysqlUrl = process.env.PLANETSCALE_URL;
  if (!planetscaleMysqlUrl) {
    throw new Error("Missing PLANETSCALE_URL");
  }

  const mysql2Driver = await mysql2(
    { runtime, driver: createConnection, databaseUrl: planetscaleMysqlUrl },
  );

  const planetscaleServerlessDriver = await planetscaleServerless(
    { runtime, driver: connect, databaseUrl: planetscaleMysqlUrl },
  );

  await run([mysql2Driver, planetscaleServerlessDriver]);
}

init();
