import { DriverParams, Driver } from "../common.ts";

export async function planetscaleServerless(
  params: DriverParams,
): Promise<Driver> {
  const connect = params.driver;
  const conn = connect({ url: params.databaseUrl });

  return {
    runtime: params.runtime,
    driverName: "ps_serverless",
    execute: (query) => conn.execute(query),
    close: async () => {},
  };
}
