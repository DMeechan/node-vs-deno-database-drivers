# Node vs Deno Database Drivers - Latency Comparison

I recently noticed some elevated latency when connecting to a Planetscale MySQL database in a Deno project.

This project exists to verify how latency compares between the various MySQL and Postgres clients available in Node and Deno.

The goal is to understand if the same drivers have different latency characteristics when running on Node vs Deno. For more driver breadth, I've included both MySQL and Postges drivers.

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
- Copy the SQL queries in `setup.sql` and run them against your databases (for now this is just a manual process) - this will create a new table with 250 rows

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

> ⚠️ MySQL2 driver doesn't currently work on Deno when using TLS, so I've unfortunately had to exclude it from this comparison.

See this bug report for more information: https://github.com/denoland/deno/issues/20293
