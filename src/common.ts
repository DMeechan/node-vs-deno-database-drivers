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

export interface Results {
  [key: string]: number[];
}

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
      milliseconds: number;
    }
  > = [];

  for (let i = 1; i <= params.iterations; i++) {
    const start = performance.now();
    await params.execute(params.query);
    const diff = performance.now() - start;

    const operation =
      `${params.runtime}-${params.driverName}-${params.queryName}-${i}`;

    // TODO: Do we care about the decimal places?
    const roundedDiff = Math.round(diff);
    const paddedDiff = String(roundedDiff).padStart(6, " ");
    console.log(`${paddedDiff}ms - ${operation}`);

    results.push({
      runtime: params.runtime,
      driverName: params.driverName,
      queryName: params.queryName,
      iteration: i,
      milliseconds: roundedDiff,
    });
  }

  return results;
}
