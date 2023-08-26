import { Driver, DriverParams, parseDatabaseURL } from "../common.ts";

export async function denoMysql(params: DriverParams): Promise<Driver> {
  const { hostname, db, username, password } = parseDatabaseURL(
    params.databaseUrl,
  );
  const Client = params.driver;
  const client = await new Client().connect({
    hostname,
    db,
    username,
    password,
    tls: { mode: "verify_identity" },
  });

  return {
    runtime: params.runtime,
    databaseProvider: params.databaseProvider,
    driverName: "deno_mysql",
    execute: (query) => client.execute(query),
    close: (): Promise<void> => client.close(),
  };
}

