import type { DatabaseBase } from "@/DatabaseBase";
import type { Column } from "@/Schema/Column";
import type { ScalarNullable } from "@/Types";
import { getDatetimeISO } from "@/Utils";

const BacktickRegExp = /`/g;

/**
 * Escapes ID.
 * @see https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/0b6b64ace271d60245823b411c98e29d5faf5e87/lib/misc/utils.js#L87
 */
export const escapeId = (value: string): string => {
  if (value === "") {
    throw new Error("DatabaseUtils.escapeId(value) cannot be empty");
  }

  if (value.includes("\u0000")) {
    throw new Error("DatabaseUtils.escapeId(value) cannot includes \\u0000");
  }

  return `\`${value.replace(BacktickRegExp, "``")}\``;
};

const literalEscapes: Record<string, string> = {
  "'": "\\'",
  "\n": "\\n",
  "\r": "\\r",
  "\b": "\\b",
  "\t": "\\t",
  "\\": "\\\\",
  "\u0000": "\\0",
  "\u001A": "\\Z",
};

// eslint-disable-next-line no-control-regex
const escapesRegExp = /['\n\r\b\t\\\u0000\u001A]/g;

const escapeString = (value: string): string =>
  value.replace(escapesRegExp, (character) => literalEscapes[character]!);

/**
 * Escapes a scalar type.
 * @see https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/0b6b64ace271d60245823b411c98e29d5faf5e87/lib/misc/utils.js#L109
 */
export const escape = (value: Buffer | Date | ScalarNullable): string => {
  switch (typeof value) {
    case "boolean":
      return value ? "TRUE" : "FALSE";

    case "bigint":
    case "number":
      return `${value}`;

    case "object": {
      if (value === null) {
        return "NULL";
      }

      if (value instanceof Date) {
        return `'${getDatetimeISO(value)}'`;
      }

      return `_binary'${escapeString(value.toString())}'`;
    }

    case "undefined":
      return "NULL";

    default:
      return `'${escapeString(value)}'`;
  }
};

/** Drop a table. */
export const dropTable = (connection: DatabaseBase, table: string) => {
  connection.query(`DROP TABLE IF EXISTS ${escapeId(table)}`);
};

/** Run SHOW CREATE TABLE to a table. */
export const showCreate = async (connection: DatabaseBase, table: string) => {
  interface TableSchemaResponse {
    "Create Table": string;
  }

  return connection
    .query(`SHOW CREATE TABLE ${escapeId(table)}`)
    .then(([schema]) => (schema as TableSchemaResponse)["Create Table"]);
};

/** Creates a table. */
export const createTable = async (
  connection: DatabaseBase,
  table: string,
  columns: Array<Column<object>>,
  options?: {
    comment?: string;
    collate?: string;
    temporary?: boolean;
  }
) => {
  const tableAs = options?.temporary === true ? "TEMPORARY TABLE" : "TABLE";
  const tableStmts = columns.map((column) => column.asCreateSchema());

  columns.forEach((column) => {
    if (column.options.key === true) {
      tableStmts.push(`KEY \`${column.name}\` (\`${column.name}\`)`);
    }

    if (column.options.uniqueKey === true) {
      tableStmts.push(`UNIQUE KEY \`${column.name}\` (\`${column.name}\`)`);
    }

    if (column.options.primaryKey === true) {
      tableStmts.push(`PRIMARY KEY (\`${column.name}\`)`);
    }
  });

  const tableOptions = [];

  if (options) {
    if (options.collate !== undefined) {
      tableOptions.push(`COLLATE=${escapeId(options.collate)}`);
    }

    if (options.comment !== undefined) {
      tableOptions.push(`COMMENT=${escape(options.comment)}`);
    }
  }

  await connection.query(
    `CREATE ${tableAs} ${escapeId(table)}` +
      `(${tableStmts.join(", ")})` +
      `ENGINE=InnoDB ${tableOptions.join(" ")}`
  );
};
