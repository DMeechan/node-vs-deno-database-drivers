import { Driver, DriverParams } from "../common.ts";

export async function postgresjs(
  params: DriverParams,
): Promise<Driver> {
  const postgres = params.driver;
  const sql = postgres(params.databaseUrl, { ssl: "require" });

  return {
    runtime: params.runtime,
    databaseProvider: params.databaseProvider,
    driverName: "postgresjs",
    execute: (query) => sql.unsafe(query),
    close: async () => await sql.end(),
  };
}
