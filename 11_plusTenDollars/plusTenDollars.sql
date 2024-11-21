UPDATE "Users"
SET "balance" = "balance" + 10
WHERE "id" IN (
    SELECT "id"
    FROM "Users"
    ORDER BY "rating" DESC
    LIMIT 3
);

