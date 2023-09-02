import "dotenv/config";
import http from "http";

import postgres from "postgres";
import { createConnection as createConnectionMysql2 } from "mysql2/promise";
import mariadbLib from "mariadb";
import { connect as planetscaleConnect } from "@planetscale/database";

import { postgresjs } from "./drivers/postgresjs.ts";
import { mysql2 } from "./drivers/mysql2.ts";
import { mariaDb } from "./drivers/mariadb.ts";
import { planetscaleServerless } from "./drivers/planetscale-serverless.ts";
import { run } from "./run.ts";

async function runWithNode() {
  const runtime = "node" as const;

  const mysqlUrl = process.env.MYSQL_URL;
  if (!mysqlUrl) {
    throw new Error("Missing MYSQL_URL");
  }

  const postgresUrl = process.env.POSTGRES_URL;
  if (!postgresUrl) {
    throw new Error("Missing POSTGRES_URL");
  }

  const postgresjsDriver = await postgresjs({
    runtime,
    databaseProvider: "pgsql",
    driver: postgres,
    databaseUrl: postgresUrl,
  });

  const mysql2Driver = await mysql2(
    {
      runtime,
      databaseProvider: "mysql",
      driver: createConnectionMysql2,
      databaseUrl: mysqlUrl,
    },
  );

  const mariadbDriver = await mariaDb(
    {
      runtime,
      databaseProvider: "mysql",
      driver: mariadbLib,
      databaseUrl: mysqlUrl,
    },
  );

  const planetscaleServerlessDriver = await planetscaleServerless(
    {
      runtime,
      databaseProvider: "mysql",
      driver: planetscaleConnect,
      databaseUrl: mysqlUrl,
    },
  );

  const results = await run([
    postgresjsDriver,
    mysql2Driver,
    mariadbDriver,
    planetscaleServerlessDriver,
  ]);

  return results;
}

function startServer() {
  const server = http.createServer();
  server.on("request", async (_req, res) => {
    const result = await runWithNode();
    console.log("GET - Fetched results: 200");

    res.writeHead(200);
    res.end(result);
  });

  const port = 8080;
  server.listen(port, () => {
    console.log(`Node listening on http://localhost:${port}`);
  });
}

startServer();
