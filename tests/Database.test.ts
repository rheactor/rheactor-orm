import type { DatabaseConnection } from "@/DatabaseConnection";
import { createTable, showCreate } from "@/DatabaseUtils";
import { Expression } from "@/Expression";
import { ColumnDefinitionType } from "@/Meta/ColumnDefinitionType";
import { Column } from "@/Schema/Column";
import { ColumnType } from "@/Schema/ColumnType";
import { createConnection } from "./Test/DatabaseConnection";

describe("Database", () => {
  const connection = createConnection();

  afterAll(() => {
    connection.close();
  });

  test("Database.query()", async () => {
    expect.assertions(4);

    const results = await connection.query("SELECT 1, ?, 3", [2]);

    expect(results).toHaveLength(1);
    expect(results[0]).toStrictEqual({ "1": 1, "2": 2, "3": 3 });
    expect(results.meta).toHaveLength(3);
    expect(results.meta[0]?.columnType).toBe(ColumnDefinitionType.LONG);
  });

  type ColumnSchema = [
    Column, // Column definition
    string, // Expected schema
    string, // Expected server implementation schema
    string? // Expected additional SQL statements (eg. INDEXs)
  ];

  const columnSchemas: ColumnSchema[] = [
    // Primary columns.
    [
      Column.create("id", ColumnType.PK),
      "`id` INT UNSIGNED NOT NULL AUTO_INCREMENT",
      "`id` int(10) unsigned NOT NULL AUTO_INCREMENT",
      "PRIMARY KEY (`id`)",
    ],
    [
      Column.create("id", ColumnType.BIGPK),
      "`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
      "`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT",
      "PRIMARY KEY (`id`)",
    ],

    // Numeric columns.
    [
      Column.create("id", ColumnType.TINYINT),
      "`id` TINYINT DEFAULT NULL",
      "`id` tinyint(4) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.SMALLINT),
      "`id` SMALLINT DEFAULT NULL",
      "`id` smallint(6) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.MEDIUMINT),
      "`id` MEDIUMINT DEFAULT NULL",
      "`id` mediumint(9) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.INT),
      "`id` INT DEFAULT NULL",
      "`id` int(11) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.BIT),
      "`id` BIT DEFAULT NULL",
      "`id` bit(1) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.FLOAT),
      "`id` FLOAT DEFAULT NULL",
      "`id` float DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.DOUBLE),
      "`id` DOUBLE DEFAULT NULL",
      "`id` double DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.DECIMAL),
      "`id` DECIMAL DEFAULT NULL",
      "`id` decimal(10,0) DEFAULT NULL",
    ],

    // Text columns.
    [
      Column.create("id", ColumnType.TINYTEXT),
      "`id` TINYTEXT DEFAULT NULL",
      "`id` tinytext DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.MEDIUMTEXT),
      "`id` MEDIUMTEXT DEFAULT NULL",
      "`id` mediumtext DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.TEXT),
      "`id` TEXT DEFAULT NULL",
      "`id` text DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.LONGTEXT),
      "`id` LONGTEXT DEFAULT NULL",
      "`id` longtext DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.CHAR),
      "`id` CHAR(255) DEFAULT NULL",
      "`id` char(255) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.VARCHAR),
      "`id` VARCHAR(255) DEFAULT NULL",
      "`id` varchar(255) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.JSON),
      "`id` JSON DEFAULT NULL",
      "`id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`id`))",
    ],

    // Binary columns.
    [
      Column.create("id", ColumnType.TINYBLOB),
      "`id` TINYBLOB DEFAULT NULL",
      "`id` tinyblob DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.MEDIUMBLOB),
      "`id` MEDIUMBLOB DEFAULT NULL",
      "`id` mediumblob DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.BLOB),
      "`id` BLOB DEFAULT NULL",
      "`id` blob DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.LONGBLOB),
      "`id` LONGBLOB DEFAULT NULL",
      "`id` longblob DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.BINARY),
      "`id` BINARY(255) DEFAULT NULL",
      "`id` binary(255) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.VARBINARY),
      "`id` VARBINARY(255) DEFAULT NULL",
      "`id` varbinary(255) DEFAULT NULL",
    ],

    // Datetime-related columns.
    [
      Column.create("id", ColumnType.DATE),
      "`id` DATE DEFAULT NULL",
      "`id` date DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.TIME),
      "`id` TIME DEFAULT NULL",
      "`id` time DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.YEAR),
      "`id` YEAR DEFAULT NULL",
      "`id` year(4) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.DATETIME),
      "`id` DATETIME DEFAULT NULL",
      "`id` datetime DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.TIMESTAMP),
      "`id` TIMESTAMP DEFAULT NULL",
      "`id` timestamp NULL DEFAULT NULL",
    ],

    // Special columns.
    [
      Column.create("id", ColumnType.ENUM),
      "`id` ENUM('') DEFAULT NULL",
      "`id` enum('') DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.SET),
      "`id` SET('') DEFAULT NULL",
      "`id` set('') DEFAULT NULL",
    ],

    // Option "nullable".
    [
      Column.create("id", ColumnType.TINYINT, { nullable: true }),
      "`id` TINYINT DEFAULT NULL",
      "`id` tinyint(4) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.TINYINT, { nullable: false }),
      "`id` TINYINT NOT NULL",
      "`id` tinyint(4) NOT NULL",
    ],

    // Option "default".
    [
      Column.create("id", ColumnType.TINYINT, { default: 0 }),
      "`id` TINYINT DEFAULT 0",
      "`id` tinyint(4) DEFAULT 0",
    ],
    [
      Column.create("id", ColumnType.TINYINT, { default: false }),
      "`id` TINYINT DEFAULT FALSE",
      "`id` tinyint(4) DEFAULT 0",
    ],
    [
      Column.create("id", ColumnType.TINYINT, { default: true }),
      "`id` TINYINT DEFAULT TRUE",
      "`id` tinyint(4) DEFAULT 1",
    ],
    [
      Column.create("id", ColumnType.VARCHAR, { default: "null" }),
      "`id` VARCHAR(255) DEFAULT 'null'",
      "`id` varchar(255) DEFAULT 'null'",
    ],
    [
      Column.create("id", ColumnType.TINYINT, { default: Expression.NULL }),
      "`id` TINYINT DEFAULT NULL",
      "`id` tinyint(4) DEFAULT NULL",
    ],

    // Option "onUpdate".
    [
      Column.create("id", ColumnType.DATETIME, { onUpdateNow: true }),
      "`id` DATETIME DEFAULT NULL ON UPDATE NOW()",
      "`id` datetime DEFAULT NULL ON UPDATE current_timestamp()",
    ],

    // Option "unsigned".
    [
      Column.create("id", ColumnType.TINYINT, { unsigned: false }),
      "`id` TINYINT DEFAULT NULL",
      "`id` tinyint(4) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.TINYINT, { unsigned: true }),
      "`id` TINYINT UNSIGNED DEFAULT NULL",
      "`id` tinyint(3) unsigned DEFAULT NULL",
    ],

    // Option "length".
    [
      Column.create("id", ColumnType.VARCHAR, { length: 20 }),
      "`id` VARCHAR(20) DEFAULT NULL",
      "`id` varchar(20) DEFAULT NULL",
    ],

    // Option "precision".
    [
      Column.create("id", ColumnType.DECIMAL, { precision: 0 }),
      "`id` DECIMAL DEFAULT NULL",
      "`id` decimal(10,0) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.DECIMAL, { precision: 2 }),
      "`id` DECIMAL(2) DEFAULT NULL",
      "`id` decimal(2,0) DEFAULT NULL",
    ],

    // Option "scale".
    [
      Column.create("id", ColumnType.DECIMAL, { scale: 0 }),
      "`id` DECIMAL(10,0) DEFAULT NULL",
      "`id` decimal(10,0) DEFAULT NULL",
    ],
    [
      Column.create("id", ColumnType.DECIMAL, { scale: 2 }),
      "`id` DECIMAL(10,2) DEFAULT NULL",
      "`id` decimal(10,2) DEFAULT NULL",
    ],

    // Option "microsecondPrecision".
    [
      Column.create("id", ColumnType.TIMESTAMP, { microsecondPrecision: 3 }),
      "`id` TIMESTAMP(3) DEFAULT NULL",
      "`id` timestamp(3) NULL DEFAULT NULL",
    ],

    // Option "bits".
    [
      Column.create("id", ColumnType.BIT, { bits: 3 }),
      "`id` BIT(3) DEFAULT NULL",
      "`id` bit(3) DEFAULT NULL",
    ],

    // Option "options".
    [
      Column.create("id", ColumnType.ENUM, { options: ["A", "B", "C'D"] }),
      "`id` ENUM('A','B','C\\'D') DEFAULT NULL",
      "`id` enum('A','B','C''D') DEFAULT NULL",
    ],

    // Option "collate".
    [
      Column.create("id", ColumnType.VARCHAR, {
        collate: "utf8mb4_general_ci",
      }),
      "`id` VARCHAR(255) COLLATE `utf8mb4_general_ci` DEFAULT NULL",
      "`id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL",
    ],

    // Option "key".
    [
      Column.create("id", ColumnType.TINYINT, { key: true }),
      "`id` TINYINT DEFAULT NULL",
      "`id` tinyint(4) DEFAULT NULL",
      "KEY `id` (`id`)",
    ],

    // Option "uniqueKey".
    [
      Column.create("id", ColumnType.TINYINT, { uniqueKey: true }),
      "`id` TINYINT DEFAULT NULL",
      "`id` tinyint(4) DEFAULT NULL",
      "UNIQUE KEY `id` (`id`)",
    ],

    // Option "invisible".
    [
      Column.create("id", ColumnType.TINYINT, { invisible: true }),
      "`id` TINYINT INVISIBLE DEFAULT NULL",
      "`id` tinyint(4) INVISIBLE DEFAULT NULL",
    ],

    // Option "comment".
    [
      Column.create("id", ColumnType.TINYINT, { comment: "TINYINT" }),
      "`id` TINYINT DEFAULT NULL COMMENT 'TINYINT'",
      "`id` tinyint(4) DEFAULT NULL COMMENT 'TINYINT'",
    ],
    [
      Column.create("id", ColumnType.TINYINT, { comment: "TINY'INT" }),
      "`id` TINYINT DEFAULT NULL COMMENT 'TINY\\'INT'",
      "`id` tinyint(4) DEFAULT NULL COMMENT 'TINY''INT'",
    ],

    // Additional tests.
    [
      Column.create("id", ColumnType.PK, { comment: "PK", invisible: true }),
      "`id` INT UNSIGNED NOT NULL INVISIBLE AUTO_INCREMENT COMMENT 'PK'",
      "`id` int(10) unsigned NOT NULL INVISIBLE AUTO_INCREMENT COMMENT 'PK'",
      "PRIMARY KEY (`id`)",
    ],
    [
      Column.create("id", ColumnType.TINYINT, {
        default: 0,
        invisible: true,
        nullable: false,
        unsigned: true,
      }),
      "`id` TINYINT UNSIGNED NOT NULL INVISIBLE DEFAULT 0",
      "`id` tinyint(3) unsigned NOT NULL INVISIBLE DEFAULT 0",
    ],
    [
      Column.create("id", ColumnType.BLOB, {
        default: "blob",
        nullable: false,
        invisible: true,
      }),
      "`id` BLOB NOT NULL INVISIBLE DEFAULT 'blob'",
      "`id` blob NOT NULL INVISIBLE DEFAULT 'blob'",
    ],
    [
      Column.create("id", ColumnType.TIMESTAMP, {
        default: Expression.NOW,
        nullable: false,
        invisible: true,
        microsecondPrecision: 3,
        onUpdateNow: true,
      }),
      "`id` TIMESTAMP(3) NOT NULL INVISIBLE DEFAULT NOW() ON UPDATE NOW()",
      "`id` timestamp(3) NOT NULL INVISIBLE DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)",
    ],
  ];

  const columnDummy = Column.create("dummy", ColumnType.TINYINT);

  describe.each(columnSchemas)(
    "Column.create()",
    (columnSchema, schemaSQL, implementationSQL, additionalSQL) => {
      test(`"${schemaSQL}" schema`, () => {
        expect(columnSchema.asCreateSchema()).toBe(schemaSQL);
      });

      const tableTest = `test-${Math.random()}`;

      let singleConnection: DatabaseConnection;

      afterAll(() => {
        singleConnection.release();
      });

      test(`"${schemaSQL}" implementation`, async () => {
        expect.assertions(1);

        singleConnection = await connection.getSingleConnection();

        await createTable(
          singleConnection,
          tableTest,
          [columnDummy, columnSchema],
          { collate: "latin1_bin", temporary: true }
        );

        const tableSchema = (await showCreate(singleConnection, tableTest))!
          .split(/\n/)
          .slice(2, -1)
          .map((line) => line.trim())
          .join("");

        const additionalResponse =
          additionalSQL === undefined ? "" : `,${additionalSQL}`;

        expect(tableSchema).toBe(implementationSQL + additionalResponse);
      });
    }
  );
});
