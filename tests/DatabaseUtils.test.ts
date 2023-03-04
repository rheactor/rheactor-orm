import type { DatabaseConnection } from "@/DatabaseConnection";
import {
  createTable,
  dropTable,
  escape,
  escapeId,
  showCreate,
} from "@/DatabaseUtils";
import { Column } from "@/Schema/Column";
import { ColumnType } from "@/Schema/ColumnType";
import { createConnection } from "@Tests/Test/DatabaseConnection";

const columnDummy = Column.create("dummy", ColumnType.TINYINT);

describe("DatabaseUtils", () => {
  describe("createTable()", () => {
    const tableTest = `test-${Math.random()}`;

    const connection = createConnection();
    let poolConnection: DatabaseConnection;

    beforeEach(async () => {
      poolConnection = await connection.getSingleConnection();
    });

    test(`options: undefined"`, async () => {
      expect.assertions(1);

      await createTable(poolConnection, tableTest, [columnDummy]);

      expect(await showCreate(poolConnection, tableTest)).toContain(
        escapeId(tableTest)
      );
    });

    test(`options.comment"`, async () => {
      expect.assertions(1);

      await createTable(poolConnection, tableTest, [columnDummy], {
        comment: "test",
      });

      expect(await showCreate(poolConnection, tableTest)).toContain(
        "COMMENT='test'"
      );
    });

    afterEach(async () => {
      dropTable(poolConnection, tableTest);
      poolConnection.release();
    });

    afterAll(() => {
      connection.close();
    });
  });

  describe.each([
    ["", "''"],
    ["test", "'test'"],
    ["te'st", "'te\\'st'"],
    ["\x00\x1A", "'\\0\\Z'"],
    ["\u0000\u001A", "'\\0\\Z'"],
    ["'\"", "'\\'\"'"],
    ["\b\n\r\t\\", "'\\b\\n\\r\\t\\\\'"],
    [123n, "123"],
    [-123n, "-123"],
    [123, "123"],
    [1.23, "1.23"],
    [-123, "-123"],
    [-1.23, "-1.23"],
    [null, "NULL"],
    [undefined, "NULL"],
    [Buffer.from("Buffer test"), "_binary'Buffer test'"],
    [Buffer.from("Buffer te'st"), "_binary'Buffer te\\'st'"],
    [new Date("2023-02-28 01:02:03"), "'2023-02-28T01:02:03.000Z'"],
    [new Date("2023-02-28 01:02:03.4567"), "'2023-02-28T01:02:03.456Z'"],
    [new Date("2023-02-28 23:59:59.001"), "'2023-02-28T23:59:59.001Z'"],
  ])("escape()", (input, expected) => {
    test(`escape('${input}')`, () => {
      expect(escape(input)).toBe(expected);
    });
  });

  describe.each([
    ["test", "`test`"],
    ["te`st", "`te``st`"],
  ])("escapeId()", (input, expected) => {
    test(`escapeId('${input}')`, () => {
      expect(escapeId(input)).toBe(expected);
    });
  });

  test("escapeId('')", () => {
    expect(() => escapeId("")).toThrowError(
      "DatabaseUtils.escapeId(value) cannot be empty"
    );
  });

  test("escapeId('\\u0000')", () => {
    expect(() => escapeId("\u0000ff")).toThrowError(
      "DatabaseUtils.escapeId(value) cannot includes \\u0000"
    );
  });
});
