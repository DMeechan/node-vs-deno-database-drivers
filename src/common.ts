type Runtime = "node" | "deno";
type DriverName = "deno_mysql" | "ps_serverless" | "mysql2";

export interface DriverParams {
  runtime: Runtime;
  driver: any;
  databaseUrl: string;
}

export interface Driver {
  runtime: "node" | "deno";
  driverName: DriverName;
  execute: (query: string) => Promise<any>;
  close: () => Promise<void>;
}

export type Results = Array<{
  runtime: Runtime;
  driverName: string;
  queryName: string;
  iteration: number;
  milliseconds: string;
}>;

export const queries = {
  select1: "SELECT 1;",
  selectPostsSmall: `SELECT * FROM posts LIMIT 25;`,
  selectPostsMedium: `SELECT * FROM posts LIMIT 250;`,
};

export async function executeQueries(
  params: {
    runtime: Runtime;
    driverName: DriverName;
    queryName: string;
    query: string;
    iterations: number;
    execute: (query: string) => Promise<any>;
  },
) {
  const results: Array<
    {
      runtime: Runtime;
      driverName: string;
      queryName: string;
      iteration: number;
      milliseconds: string;
    }
  > = [];

  for (let i = 1; i <= params.iterations; i++) {
    const start = performance.now();
    await params.execute(params.query);
    const diff = performance.now() - start;

    const operation = `${params.driverName}-${params.queryName}-${i}`;
    const formattedDiff = diff.toLocaleString("en-GB", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    const paddedDiff = formattedDiff.padStart(6, " ");
    console.log(`${paddedDiff}ms - ${operation}`);

    results.push({
      runtime: params.runtime,
      driverName: params.driverName,
      queryName: params.queryName,
      iteration: i,
      milliseconds: formattedDiff,
    });
  }

  return results;
}
