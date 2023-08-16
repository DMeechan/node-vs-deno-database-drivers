import { readFileSync } from "node:fs";

import { Driver, DriverParams } from "../common.ts";

export async function mysql2(
  params: DriverParams,
): Promise<Driver> {
  const cert = readFileSync("/etc/ssl/certs/ca-certificates.crt");

  const createConnection = params.driver;
  const connection = await createConnection({
    uri: params.databaseUrl,
    ssl: { ca: cert },
  });

  return {
    runtime: params.runtime,
    driverName: "mysql2",
    execute: (query) => connection.execute(query),
    close: () => connection.end(),
  };
}
