UPDATE "Contests" c
SET prize = c."prize" * 1.1
FROM "Users" u
WHERE c."userId" = u.id
  AND u."role" = 'customer'
  AND c."createdAt" BETWEEN '2023-12-25' AND '2024-01-14';

-- test 
-- SELECT *
-- FROM "Contests"
-- WHERE "createdAt" BETWEEN '2023-12-25' AND '2024-01-14'
-- ORDER BY "createdAt" DESC;


-- SELECT *
-- FROM "Contests"
-- ORDER BY "createdAt" DESC;

