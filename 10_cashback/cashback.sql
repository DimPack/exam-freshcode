UPDATE "Users"
SET "balance" = "balance" + "cashback"."total_cashback"
FROM (
  SELECT
    "userId",
    SUM("prize") * 0.10 AS "total_cashback"
  FROM "Contests"
  WHERE "createdAt"::date BETWEEN '2024-12-25' AND '2025-01-14'
  GROUP BY "userId"
) AS "cashback"
WHERE "Users"."id" = "cashback"."userId"
  AND "Users"."role" = 'customer'
  RETURNING *;


