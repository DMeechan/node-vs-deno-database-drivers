# Node vs Deno Database Drivers

I recently noticed some elevated latency when connecting to a Planetscale MySQL database in a Deno project.

This project exists to verify how latency compares between the various MySQL and Postgres clients available in Node and Deno.

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
  - [Neon.tech](https://neon.tech/) - serverless Postgres
  - [Supabase](https://supabase.com/) - Postgres (I'm just using the database, not their "Firebase alternative" features)
- Create a `.env` file: `cp .env.example .env`
- Enter your database connection URLs into the `.env` file


### Running it

Run the Node.js tests:

```bash
npm run start
```

Run the Deno tests:

```bash
deno task start
```

Look in your `results` folder for the CSV results!

### Results

Testing is done using:

- Fly.io `performance-1x` server with 1 CPU and 2GB RAM, hosted in Frankfurt
- Planetscale Serverless MySQL, hosted in `aws-eu-central-1` (Frankfurt)
- Neon.tech Serverless Postgres, hosted in `aws-eu-central-1` (Frankfurt)
- Supabase Postgres, hosted in `gcp-europe-west3` (Frankfurt)

This comparison **is not intended to compare Postgres vs MySQL**.

The goal is to compare the performance of various database drivers in the Node.js and Deno ecosystems.

RESULTS: coming soon.

### Compatibility issues

> ⚠️ MySQL2 driver doesn't currently work on Deno when using TLS

mysql2 throws this error on Deno 1.36.1: `Uncaught Error: tlssock._start is not a function`

This error was solved a few days ago with: https://github.com/denoland/deno/pull/20120

But now on Deno Canary (1.36.1+4380a09), mysql2 throws:

```js
error: Uncaught (in promise) Error: read UNKNOWN
  at createConnection (file:///home/node-vs-deno-db-drivers/node_modules/.deno/mysql2@3.6.0/node_modules/mysql2/promise.js:253:31)
  at mysql2 (file:///home/node-vs-deno-db-drivers/src/drivers/mysql2.ts:11:28)
  at init (file:///home/node-vs-deno-db-drivers/src/deno.ts:32:30)
  at async file:///home/node-vs-deno-db-drivers/src/deno.ts:40:1
```
