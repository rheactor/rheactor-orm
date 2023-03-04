import { Database } from "@/index";

export const databaseName = process.env["TESTING_DATABASE"] ?? "test";

export const createConnection = () =>
  Database.createConnection({
    database: databaseName,
    user: process.env["TESTING_USER"],
    password: process.env["TESTING_PASSWORD"],
  });
