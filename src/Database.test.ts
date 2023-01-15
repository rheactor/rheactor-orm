import { Database } from "@/Database";
import { ColumnDefinitionType } from "@/Meta/ColumnDefinition";
import { Column } from "@/Schema/Column";
import { DataType } from "@/Schema/DataType";
import { Expression } from "./Expression";

describe("Database tests", () => {
  const database = process.env["TESTING_DATABASE"] ?? "test";
  const connection = Database.createConnection({
    database,
    user: process.env["TESTING_USER"],
    password: process.env["TESTING_PASSWORD"],
  });

  afterAll(() => {
    connection.close();
  });

  test("basic select", async () => {
    expect.assertions(4);

    const results = await connection.querySelect("SELECT 1, ?, 3", [2]);

    expect(results).toHaveLength(1);
    expect(results[0]).toStrictEqual({ "1": 1, "2": 2, "3": 3 });
    expect(results.meta).toHaveLength(3);
    expect(results.meta[0]?.columnType).toBe(ColumnDefinitionType.INT);
  });

  test("basic execution", async () => {
    expect.assertions(3);

    const result = await connection.queryExecute(
      `USE \`${connection.options.database}\``
    );

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

  describe("Column schema", () => {
    test("column schemas", () => {
      expect(
        Column.create("id", DataType.PK, {
          comment: "Primary Key",
          invisible: true,
        }).asCreateSchema(connection)
      ).toBe(
        "`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY INVISIBLE COMMENT 'Primary Key'"
      );

      expect(
        Column.create("id", DataType.BIGPK).asCreateSchema(connection)
      ).toBe("`id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY");

      expect(
        Column.create("id", DataType.TINYINT, {
          comment: "TINYINT",
          default: 123,
          nullable: true,
          unsigned: true,
          invisible: true,
          unique: true,
        }).asCreateSchema(connection)
      ).toBe(
        "`id` TINYINT UNSIGNED NULL DEFAULT '123' INVISIBLE UNIQUE COMMENT 'TINYINT'"
      );

      expect(Column.create("id", DataType.BIT).asCreateSchema(connection)).toBe(
        "`id` BIT"
      );

      expect(
        Column.create("id", DataType.BIT, { bits: 5 }).asCreateSchema(
          connection
        )
      ).toBe("`id` BIT(5)");

      expect(
        Column.create("id", DataType.FLOAT).asCreateSchema(connection)
      ).toBe("`id` FLOAT");

      expect(
        Column.create("id", DataType.DOUBLE).asCreateSchema(connection)
      ).toBe("`id` DOUBLE");

      expect(
        Column.create("id", DataType.DECIMAL).asCreateSchema(connection)
      ).toBe("`id` DECIMAL");

      expect(
        Column.create("id", DataType.DECIMAL, {
          scale: 2,
        }).asCreateSchema(connection)
      ).toBe("`id` DECIMAL(10,2)");

      expect(
        Column.create("id", DataType.DECIMAL, {
          precision: 8,
          scale: 2,
        }).asCreateSchema(connection)
      ).toBe("`id` DECIMAL(8,2)");

      expect(
        Column.create("id", DataType.TINYTEXT).asCreateSchema(connection)
      ).toBe("`id` TINYTEXT");

      expect(
        Column.create("id", DataType.MEDIUMTEXT).asCreateSchema(connection)
      ).toBe("`id` MEDIUMTEXT");

      expect(
        Column.create("id", DataType.TEXT).asCreateSchema(connection)
      ).toBe("`id` TEXT");

      expect(
        Column.create("id", DataType.LONGTEXT).asCreateSchema(connection)
      ).toBe("`id` LONGTEXT");

      expect(
        Column.create("id", DataType.JSON).asCreateSchema(connection)
      ).toBe("`id` JSON");

      expect(
        Column.create("id", DataType.CHAR, {
          collate: "a",
          characterSet: "b",
          fullText: true,
          length: 30,
        }).asCreateSchema(connection)
      ).toBe("`id` CHAR(30) CHARACTER SET 'b' COLLATE 'a'");

      expect(
        Column.create("id", DataType.VARCHAR).asCreateSchema(connection)
      ).toBe("`id` VARCHAR(255)");

      expect(
        Column.create("id", DataType.TINYBLOB).asCreateSchema(connection)
      ).toBe("`id` TINYBLOB");

      expect(
        Column.create("id", DataType.MEDIUMBLOB).asCreateSchema(connection)
      ).toBe("`id` MEDIUMBLOB");

      expect(
        Column.create("id", DataType.BLOB).asCreateSchema(connection)
      ).toBe("`id` BLOB");

      expect(
        Column.create("id", DataType.LONGBLOB).asCreateSchema(connection)
      ).toBe("`id` LONGBLOB");

      expect(
        Column.create("id", DataType.BINARY, { length: 30 }).asCreateSchema(
          connection
        )
      ).toBe("`id` BINARY(30)");

      expect(
        Column.create("id", DataType.VARBINARY).asCreateSchema(connection)
      ).toBe("`id` VARBINARY(255)");

      expect(
        Column.create("id", DataType.DATE).asCreateSchema(connection)
      ).toBe("`id` DATE");

      expect(
        Column.create("id", DataType.TIME, {
          microsecondPrecision: 6,
        }).asCreateSchema(connection)
      ).toBe("`id` TIME(6)");

      expect(
        Column.create("id", DataType.YEAR).asCreateSchema(connection)
      ).toBe("`id` YEAR");

      expect(
        Column.create("id", DataType.DATETIME, {
          onUpdate: new Expression("NOW()"),
        }).asCreateSchema(connection)
      ).toBe("`id` DATETIME DEFAULT NULL ON UPDATE NOW()");

      expect(
        Column.create("id", DataType.TIMESTAMP, {
          default: new Expression("NOW()"),
          onUpdate: new Expression("NOW()"),
        }).asCreateSchema(connection)
      ).toBe("`id` TIMESTAMP DEFAULT NOW() ON UPDATE NOW()");

      expect(
        Column.create("id", DataType.ENUM).asCreateSchema(connection)
      ).toBe("`id` ENUM('')");

      expect(
        Column.create("id", DataType.ENUM, {
          options: ["a", "b", "c"],
        }).asCreateSchema(connection)
      ).toBe("`id` ENUM('a','b','c')");

      expect(
        Column.create("id", DataType.SET, {
          default: "a,b",
          options: ["a", "b", "c"],
        }).asCreateSchema(connection)
      ).toBe("`id` SET('a','b','c') DEFAULT 'a,b'");
    });
  });

  describe("Table schema", () => {
    const tableA = `test-${Math.random()}`;

    beforeAll(async () => {
      await connection.createTable(
        tableA,
        [
          Column.create("id", DataType.PK, {
            invisible: true,
          }),

          Column.create("integer_tiny", DataType.TINYINT, {
            comment: "TINYINT",
            index: true,
            default: 123,
            nullable: false,
            unsigned: true,
            unique: true,
          }),
          Column.create("integer_small_a", DataType.SMALLINT),
          Column.create("integer_medium_a", DataType.MEDIUMINT),
          Column.create("integer_int_a", DataType.INT, { default: 123 }),
          Column.create("integer_bigint_a", DataType.BIGINT),
          Column.create("integer_bits_a", DataType.BIT),
          Column.create("integer_bits_b", DataType.BIT, { bits: 5 }),
          Column.create("integer_float_a", DataType.FLOAT),
          Column.create("integer_double_a", DataType.DOUBLE),
          Column.create("integer_decimal_a", DataType.DECIMAL),
          Column.create("integer_decimal_b", DataType.DECIMAL, {
            precision: 5,
            scale: 2,
          }),
          Column.create("integer_decimal_c", DataType.DECIMAL, { scale: 2 }),

          Column.create("string_text_tiny_a", DataType.TINYTEXT),
          Column.create("string_text_medium_a", DataType.MEDIUMTEXT),
          Column.create("string_text_text_a", DataType.TEXT),
          Column.create("string_text_long_a", DataType.LONGTEXT),
          Column.create("string_text_json_a", DataType.JSON),
          Column.create("string_char_a", DataType.CHAR),
          Column.create("string_varchar_a", DataType.VARCHAR, {
            length: 30,
            characterSet: "latin1",
            collate: "latin1_general_ci",
          }),

          Column.create("binary_blob_tiny_a", DataType.TINYBLOB),
          Column.create("binary_blob_medium_a", DataType.MEDIUMBLOB),
          Column.create("binary_blob_blob_a", DataType.BLOB),
          Column.create("binary_blob_long_a", DataType.LONGBLOB),
          Column.create("binary_char_a", DataType.BINARY),
          Column.create("binary_varchar_a", DataType.VARBINARY, {
            length: 30,
          }),

          Column.create("temporal_date_a", DataType.DATE),
          Column.create("temporal_date_time_a", DataType.DATETIME, {
            default: new Expression("NOW()"),
            onUpdate: new Expression("NOW()"),
          }),
          Column.create("temporal_time_a", DataType.TIME),
          Column.create("temporal_timestamp_a", DataType.TIMESTAMP),
          Column.create("temporal_year_a", DataType.YEAR),

          Column.create("list_enum_a", DataType.ENUM, {
            options: ["a", "b", "c"],
          }),
          Column.create("list_set_a", DataType.SET, {
            options: ["a", "b", "c"],
          }),
        ],
        {
          comment: "Test Table",
        }
      );
    });

    afterAll(async () => {
      await connection.dropTable(tableA);
    });

    test("get test table", async () => {
      expect.assertions(1);

      const tableSchema = await connection.getTableSchema(tableA);

      expect(tableSchema.comment).toBe("Test Table");
    });
  });
});
