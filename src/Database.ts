import type { Pool } from "mariadb";
import { createPool } from "mariadb";

import type { ExecuteResult } from "@/Meta/ExecuteResult";
import type { SelectResult } from "@/Meta/SelectResult";
import type { Column } from "@/Schema/Column";
import type { ScalarNullable } from "@/Types";

export interface DatabaseCreateConnectionOptions {
  /**
   * Database hostname to connect to.
   * By default "127.0.0.1".
   */
  host?: string;

  /**
   * Database username to be used during the connection.
   * By default "root".
   */
  user?: string;

  /**
   * Database password to be used during the connection.
   * By default "" (empty string).
   */
  password?: string;

  /**
   * Database name to be used by this connection.
   * Required.
   */
  database: string;
}

export interface DatabaseCreateTableOptions {
  /** Table comment. */
  comment?: string;
}

interface InformationSchemaTable {
  /** Table comment. */
  table_comment: string;
}

export interface DatabaseTableSchema {
  /** Table name. */
  name: string;

  /** Table comment. */
  comment?: string;
}

export class Database {
  private constructor(
    public readonly options: DatabaseCreateConnectionOptions,
    private readonly connection: Pool
  ) {}

  /** Creates a new Database connection. */
  public static createConnection(options: DatabaseCreateConnectionOptions) {
    return new Database(
      options,
      createPool({
        host: "127.0.0.1",
        user: "root",

        ...options,
      })
    );
  }

  /** Run a SELECT query using current database connection. */
  public async querySelect<T extends object>(
    sql: string,
    values?: ScalarNullable[]
  ): Promise<SelectResult<T>> {
    return this.connection.query(sql, values);
  }

  /**
   * Run a DML query using current database connection.
   * Example: INSERT, UPDATE and DELETE.
   */
  public async queryExecute(
    sql: string,
    values?: ScalarNullable[]
  ): Promise<ExecuteResult> {
    return this.connection.query(sql, values);
  }

  /**
   * Escapes query data.
   * @example "WHERE id = ?
   */
  public escape(value: unknown) {
    return this.connection.escape(value);
  }

  /**
   * Escapes query identifier.
   * @example "SELECT * FROM ?"
   */
  public escapeId(identifier: string) {
    return this.connection.escapeId(identifier);
  }

  /** Creates a new Table. */
  public async createTable(
    name: string,
    columns: Array<Column<object>>,
    options?: DatabaseCreateTableOptions
  ): Promise<void> {
    this.connection.query(`
      CREATE TABLE ${this.escapeId(name)}
        ( ${columns.map((column) => column.asCreateSchema(this)).join(", ")} )
      ENGINE = InnoDB
      ${options?.comment ? `COMMENT = ${this.escape(options.comment)}` : ""}
    `);
  }

  /** Drop an existing table. */
  public async dropTable(name: string): Promise<void> {
    this.connection.query(`DROP TABLE IF EXISTS ${this.escapeId(name)}`);
  }

  /** Get a Table schema from Information Schema. */
  public async getTableSchema(name: string): Promise<DatabaseTableSchema> {
    const tableSchema = await this.querySelect<InformationSchemaTable>(
      `
      SELECT table_comment
      FROM information_schema.tables

      WHERE
        table_schema = ? AND
        table_name = ?

      LIMIT 1
      `,
      [this.options.database, name]
    );

    return {
      name,
      comment: tableSchema[0]!.table_comment,
    };
  }

  /** Closes connection. */
  public close() {
    this.connection.end();
  }
}
