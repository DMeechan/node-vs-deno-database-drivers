import { Driver, DriverParams } from "../common.ts";

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
    driverName: "deno_mysql",
    execute: (query) => client.execute(query),
    close: (): Promise<void> => client.close(),
  };
}

function parseDatabaseURL(DATABASE_URL: string) {
  const dbUrlRegex = /mysql:\/\/([^:]+):([^@]+)@([^/]+)\/(([^?]+)(.+))/;
  const matches = DATABASE_URL.match(dbUrlRegex);

  if (!matches || matches.length !== 7) {
    throw new Error("Invalid DATABASE_URL format");
  }

  const [, username, password, hostname, db, _] = matches;
  return {
    hostname,
    db,
    username,
    password,
  };
}
