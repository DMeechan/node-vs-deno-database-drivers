# This file contains the key commands to spin up two apps on Fly.io for this project.
# After using the "fly launch" commands to create your apps & their config files, you can copy the configs from ./deploy/fly.<RUNTIME>.toml
# Note that the "performance-1x" VM size is not part of Fly's free tier.
# Also, you can remove the "--local-only" flags if you want the Docker images to be build on Fly's servers, instead of your local machine.
# Remember to run "fly scale count 0" on both your apps when you're done. Otherwise you'll build up a big bill!


# Deno
fly launch --name db-drivers-deno-example --region lhr --local-only --build-only --dockerfile deploy/Dockerfile.deno --internal-port 8080

fly secrets set -a db-drivers-deno-example MYSQL_URL='XXX' POSTGRES_URL='XXX' DENO_CERT=./certs/supabase.crt

fly deploy --local-only -a db-drivers-deno-example

fly scale count 1 -a db-drivers-deno-example
fly scale vm performance-1x -a db-drivers-deno-example



# Node
fly launch --name db-drivers-node-example --region lhr --local-only --build-only --dockerfile deploy/Dockerfile.node --internal-port 8080

fly secrets set -a db-drivers-node-example MYSQL_URL='XXX' POSTGRES_URL='XXX'

fly deploy --local-only -a db-drivers-node-example

fly scale count 1 -a db-drivers-node-example
fly scale vm performance-1x -a db-drivers-node-example
