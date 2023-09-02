import "std/dotenv/load.ts";

import postgres from "postgresjs";
import { Client as DenoMysqlClient } from "deno_mysql";
import { connect } from "@planetscale/database";

import { postgresjs } from "./drivers/postgresjs.ts";
import { denoMysql } from "./drivers/deno_mysql.ts";
import { planetscaleServerless } from "./drivers/planetscale-serverless.ts";

import { run } from "./run.ts";

async function runWithDeno() {
  const runtime = "deno" as const;

  const mysqlUrl = Deno.env.get("MYSQL_URL")!;
  if (!mysqlUrl) {
    throw new Error("Missing MYSQL_URL");
  }

  const postgresUrl = Deno.env.get("POSTGRES_URL")!;
  if (!postgresUrl) {
    throw new Error("Missing POSTGRES_URL");
  }

  const postgresjsDriver = await postgresjs({
    runtime,
    databaseProvider: "pgsql",
    driver: postgres,
    databaseUrl: postgresUrl,
  });

  const denoMysqlDriver = await denoMysql({
    runtime,
    databaseProvider: "mysql",
    driver: DenoMysqlClient,
    databaseUrl: mysqlUrl,
  });

  const planetscaleServerlessDriver = await planetscaleServerless(
    {
      runtime,
      databaseProvider: "mysql",
      driver: connect,
      databaseUrl: mysqlUrl,
    },
  );

  const results = await run([
    postgresjsDriver,
    denoMysqlDriver,
    planetscaleServerlessDriver,
  ]);

  return results;
}

async function startServer() {
  const port = 8080;
  const server = Deno.listen({ port });
  console.log(`Deno listening on http://localhost:${port}`);

  for await (const conn of server) {
    // In order to not be blocking, we need to handle each connection individually
    // without awaiting the function
    serveHttp(conn);
  }

  async function serveHttp(conn: Deno.Conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);

    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
      const result = await runWithDeno();
      console.log("Done! Responding with 200");

      await requestEvent.respondWith(
        new Response(result, {
          status: 200,
        }),
      );
    }
  }
}

await startServer();
