SELECT json_object_agg(role, count) AS "roles"
FROM (
    SELECT role, COUNT(*) AS "count"
    FROM "Users"
    GROUP BY role
    ORDER BY "count" DESC
) AS "result";
