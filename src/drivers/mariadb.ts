import { Driver, DriverParams, parseDatabaseURL } from "../common.ts";

export async function mariaDb(params: DriverParams): Promise<Driver> {
  const { hostname, db, username, password } = parseDatabaseURL(
    params.databaseUrl,
  );

  const mariadb = params.driver;
  const connection = await mariadb.createConnection({
    host: hostname,
    database: db,
    user: username,
    password,
    ssl: true,
  });

  return {
    runtime: params.runtime,
    databaseProvider: params.databaseProvider,
    driverName: "mariadb",
    execute: (query) => connection.query(query),
    close: (): Promise<void> => connection.end(),
  };
}

// import mariadbLib from "mariadb";
// import { mariaDb } from "./drivers/mariadb.ts";
// mariaDB hangs on connection.end() with Node 18 but succeeds with Node 16 :(
// const mariadbDriver = await mariaDb(
//   {
//     runtime,
//     databaseProvider: "mysql_planetscale",
//     driver: mariadbLib,
//     databaseUrl: planetscaleMysqlUrl,
//   },
// );
