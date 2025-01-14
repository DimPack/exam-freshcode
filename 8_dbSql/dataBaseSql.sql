CREATE TABLE "Conversations" (
  "id" SERIAL PRIMARY KEY,
  "favoriteList" BOOLEAN[],
  "blackList" BOOLEAN[],
  "participants" INT[],
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Messages" (
  "id" SERIAL PRIMARY KEY,
  "sender" INT REFERENCES "Users"("id"),
  "body" TEXT(500) NOT NULL,
  "conversation" INT REFERENCES "Conversations"("id"),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE "Catalog" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT REFERENCES "Users"("id"),
  "catalogName" VARCHAR(255) NOT NULL,
  "chats" INT[]
);