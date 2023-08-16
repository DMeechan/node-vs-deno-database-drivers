import { writeFileSync } from "node:fs";
import { Driver, executeQueries, queries, Results } from "./common.ts";

export async function run(drivers: Driver[]): Promise<Results> {
  let results: Results = [];

  // Maybe shuffle drivers array?
  for (const driver of drivers) {
    const iterations = 5;

    const connectResults = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      queryName: "connect",
      query: queries.select1,
      iterations: 1,
      execute: driver.execute,
    });

    const select1Results = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      queryName: "select1",
      query: queries.select1,
      iterations,
      execute: driver.execute,
    });

    const selectPostsSmallResults = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      queryName: "selectPostsSmall",
      query: queries.selectPostsSmall,
      iterations,
      execute: driver.execute,
    });

    const selectPostsMediumResults = await executeQueries({
      runtime: driver.runtime,
      driverName: driver.driverName,
      queryName: "selectPostsMedium",
      query: queries.selectPostsMedium,
      iterations,
      execute: driver.execute,
    });

    results = results.concat(
      connectResults,
      select1Results,
      selectPostsSmallResults,
      selectPostsMediumResults,
    );

    await driver.close();
  }

  const csv = toCsv(results);
  writeResults(results[0].runtime, csv);

  return results;
}

function writeResults(runtime: string, csv: string) {
  const datetime = new Date().toISOString().split(".")[0];
  const cleanerDatetime = datetime.replace("T", "-");
  const filename = `./results/${runtime}-${cleanerDatetime}.csv`;
  writeFileSync(filename, csv);
}

function toCsv(results: Results): string {
  const columns = [
    "runtime",
    "driverName",
    "queryName",
    "iteration",
    "milliseconds",
  ];

  const csvString = [
    columns,
    ...results.map((item) => [
      item.runtime,
      item.driverName,
      item.queryName,
      item.iteration,
      item.milliseconds,
    ]),
  ].map((e) => e.join(","))
    .join("\n")
    .concat("\n");

  return csvString;
}
