# Node vs Deno Database Drivers - Latency Comparison

I recently noticed some elevated latency when connecting to a Planetscale MySQL database in a Deno project.

This project exists to verify how latency compares between the various MySQL and Postgres clients available in Node and Deno.

The goal is to understand if the same drivers have different latency characteristics when running on Node vs Deno. For more driver breadth, I've included both MySQL and Postgres drivers.

### How do I run this?

#### Prerequisites

- Install Deno 1.36.1: https://deno.land/manual@v1.36.1/getting_started/installation
- Install Node.js 18.17.1: https://nodejs.org/en/download

Check your Node and Deno versions with:

```bash
deno --version
# deno 1.36.1 (release, x86_64-unknown-linux-gnu)
# v8 11.6.189.12
# typescript 5.1.6

node -v
# v18.17.1
```

#### Set up

- Clone and `cd` into this repository
- Set up your databases and make a note of the database connection URLs. I'm using:
  - [Planetscale](https://planetscale.com/) - serverless MySQL
  - [Supabase](https://supabase.com/) - Postgres (I'm just using the database, not their "Firebase alternative" features). To connect to Supabase using Deno, you'll need to download an "SSL Certificate" from your Supabase database settings. Then save it in your local repo: `./certs/supabase.crt` ([see here](https://github.com/denoland/deno/issues/20362) and look into `DENO_CERT` environment variable for more info)
- Create a `.env` file: `cp .env.example .env`
- Enter your database connection URLs into the `.env` file
- Connect to your databases and (manually) execute the SQL queries in `setup.sql` - it will create a `posts` table with 250 rows

### Running it

Start the Node.js tests server:

```bash
npm run start
```

Visit `http://localhost:8080` and wait a bit for it to run! (browsers may time out while waiting for results - I recommend using a HTTP client like [Insomnia](https://insomnia.rest/), which didn't time out in my testing).

When you're done, shut down the server so port 8080 is free to run with Deno.

Now run the Deno tests server and repeat the same steps:

```bash
deno task start
```



### Results

Testing is done using:

- Fly.io `performance-1x` server with 1 CPU and 2GB RAM, hosted in `lhr` (London)
- Planetscale Serverless MySQL free tier, hosted in `aws-eu-west-2` (London)
- Supabase Postgres free tier, hosted in `gcp-europe-west2` (London)
- 50 iterations per query, per driver, per runtime

This comparison **is not intended to compare Postgres vs MySQL**.

The goal is to compare the performance of various database drivers in the Node.js and Deno ecosystems. These graphs show the min/p25/p75/max of each driver and runtime tested:

![Connect and SELECT 1 - query results](results/2023-09-02-fly-london-results-1.png?raw=true)
![Select 25 rows and select 250 rows - query results](results/2023-09-02-fly-london-results-2.png?raw=true)

The results are pretty close, with the exception of [Planetscale Serverless](https://www.npmjs.com/package/@planetscale/database) when running on Deno.

You can find the data in CSV format in `./results`.

### Compatibility issues

> ⚠️ MySQL2 and MariaDB drivers do not currently work on Deno when using TLS, so this repo currently only uses them with Node.js.

See this bug report for more information: https://github.com/denoland/deno/issues/20293
