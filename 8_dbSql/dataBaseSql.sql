CREATE TABLE "Conversations" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "favoriteList" BOOLEAN[],
  "blackList" BOOLEAN[],
  "participants" INT[]
);

CREATE TABLE "Messages" (
  "id" SERIAL PRIMARY KEY,
  "sender" INT REFERENCES "Users"("id"),
  "body" TEXT NOT NULL,
  "conversation" INT REFERENCES "Conversations"("id"),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Catalog" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT REFERENCES "Users"("id"),
  "catalogName" VARCHAR(255) NOT NULL,
  "chats" INT[]
);