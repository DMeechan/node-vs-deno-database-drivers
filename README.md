# Node vs Deno Database Drivers

I recently encountered some elevated latency when connecting to a MySQL database in a Deno project.

This project exists to verify how latency compares between the various MySQL and Postgres clients available in Node and Deno.

### Results

Testing is done using:

- Fly.io `performance-1x` server with 1 CPU and 2GB RAM, hosted in Frankfurt
- Planetscale Serverless MySQL, hosted in `aws-eu-central-1` (Frankfurt)
- Neon.tech Serverless Postgres, hosted in `aws-eu-central-1` (Frankfurt)
- Supabase Postgres, hosted in `gcp-europe-west3` (Frankfurt)

This comparison **is not intended to compare Postgres vs MySQL**.

The goal is to compare the performance of various database drivers in the Node.js and Deno ecosystems.
