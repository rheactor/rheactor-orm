import { Database } from "@/Database";
import { ColumnType } from "@/Meta/ColumnDefinition";

const database = process.env["TESTING_DATABASE"] ?? "test";
const user = process.env["TESTING_USER"];
const password = process.env["TESTING_PASSWORD"];

describe("Database tests", () => {
  const connection = Database.createConnection({ database, user, password });

  afterAll(() => {
    connection.close();
  });

  test("Check basic select", async () => {
    expect.assertions(4);

    const results = await connection.querySelect("SELECT 1, ?, 3", [2]);

    expect(results).toHaveLength(1);
    expect(results[0]).toStrictEqual({ "1": 1, "2": 2, "3": 3 });
    expect(results.meta).toHaveLength(3);
    expect(results.meta[0]?.columnType).toBe(ColumnType.INT);
  });

  test("Check basic execution", async () => {
    expect.assertions(3);

    const result = await connection.queryExecute(`USE \`${database}\``);

    expect(result.affectedRows).toBe(0);
    expect(result.insertId).toBe(0n);
    expect(result.warningStatus).toBe(0);
  });

  test("escapers", () => {
    expect(connection.escape("test")).toBe("'test'");
    expect(connection.escape(123)).toBe("123");
    expect(connection.escape(true)).toBe("true");
    expect(connection.escape(false)).toBe("false");
    expect(connection.escapeId("test")).toBe("`test`");
  });
});
