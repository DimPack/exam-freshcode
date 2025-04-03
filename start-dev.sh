#!/usr/bin/env bash

#################################
## Run application in DEV mode ##
#################################

started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker compose --file docker-compose-dev.yaml up -d
echo ""

# Wait for the database to be ready
echo "-----> Waiting for the database to be ready..."
until docker exec -it exam-freshcode-db-dev-1 pg_isready -h db-dev -p 5432 -U postgres > /dev/null 2>&1; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Run Sequelize's migrations.
echo "-----> Running application migrations"
docker exec -it exam-freshcode-server-dev-1 npx sequelize db:migrate
echo ""

# Run Sequelize's seeds.
echo "-----> Running application seeds"
docker exec -it exam-freshcode-server-dev-1 npx sequelize db:seed:all
echo "<----- Seeds created"

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"