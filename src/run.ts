import { writeFileSync } from "node:fs";

import { Driver, executeQueries, Results } from "./common.ts";
import { calcAverage, calcMax, calcMin, calcQuartile } from "./stats.ts";

const queries = {
  select1: "SELECT 1;",
  selectPostsSmall: `SELECT * FROM posts LIMIT 25;`,
  selectPostsMedium: `SELECT * FROM posts LIMIT 250;`,
};

export async function run(drivers: Driver[]): Promise<Results> {
  const results: Results = {};

  // TODO: Maybe shuffle drivers array?
  for (const driver of drivers) {
    const iterations = 20;

    const connectResults = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      databaseProvider: driver.databaseProvider,
      queryName: "connect",
      query: queries.select1,
      iterations: 1,
      execute: driver.execute,
    });

    const select1Results = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      databaseProvider: driver.databaseProvider,
      queryName: "select1",
      query: queries.select1,
      iterations,
      execute: driver.execute,
    });

    const selectPostsSmallResults = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      databaseProvider: driver.databaseProvider,
      queryName: "selectPostsSmall",
      query: queries.selectPostsSmall,
      iterations,
      execute: driver.execute,
    });

    const selectPostsMediumResults = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      databaseProvider: driver.databaseProvider,
      queryName: "selectPostsMedium",
      query: queries.selectPostsMedium,
      iterations,
      execute: driver.execute,
    });

    const driverResults = connectResults.concat(
      select1Results,
      selectPostsSmallResults,
      selectPostsMediumResults,
    );

    for (const result of driverResults) {
      const key =
        `${result.runtime},${result.databaseProvider},${result.driverName},${result.queryName}`;

      if (!results[key]) {
        results[key] = [];
      }

      results[key].push(result.milliseconds);
    }

    await driver.close();
  }

  const stats = getStats(results);
  const csv = toCsv(stats);
  const runtime = drivers[0].runtime;
  writeResults(runtime, csv);

  return results;
}

function getStats(results: Results) {
  const stats = [];
  for (const [testName, values] of Object.entries(results)) {
    const min = calcMin(values);
    const max = calcMax(values);
    const avg = calcAverage(values);
    const p25 = calcQuartile(values, 25);
    const p75 = calcQuartile(values, 75);
    const row = [testName, min, p25, avg, p75, max].join(",");
    stats.push(row);
    console.log(row);
  }

  return stats;
}

function writeResults(runtime: string, csv: string) {
  const datetime = new Date().toISOString().split(".")[0];
  const cleanerDatetime = datetime.replace("T", "-");
  const filename = `./results/${runtime}-${cleanerDatetime}.csv`;
  writeFileSync(filename, csv);
}

function toCsv(stats: any[]): string {
  const columns = [
    "runtime",
    "databaseProvider",
    "driverName",
    "queryName",
    "min",
    "p25",
    "avg",
    "p75",
    "max",
  ].join(",");

  const csvString = [
    columns,
    ...stats,
  ]
    .join("\n")
    .concat("\n");

  return csvString;
}
