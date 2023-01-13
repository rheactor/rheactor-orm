import type { Pool } from "mariadb";
import { createPool } from "mariadb";

import type { ExecuteResult } from "@/Meta/ExecuteResult";
import type { SelectResult } from "@/Meta/SelectResult";
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

export class Database {
  private constructor(private readonly connection: Pool) {}

  /**
   * Creates a new Database connection.
   */
  public static createConnection(options: DatabaseCreateConnectionOptions) {
    return new Database(
      createPool({
        host: "127.0.0.1",
        user: "root",

        ...options,
      })
    );
  }

  /**
   * Run a SELECT query using current database connection.
   */
  public async querySelect<T extends object>(sql: string, values?: ScalarNullable[]): Promise<SelectResult<T>> {
    return this.connection.query(sql, values);
  }

  /**
   * Run a DML query using current database connection.
   * Example: INSERT, UPDATE and DELETE.
   */
  public async queryExecute(sql: string, values?: ScalarNullable[]): Promise<ExecuteResult> {
    return this.connection.query(sql, values);
  }

  /**
   * Closes connection.
   */
  public close() {
    this.connection.end();
  }
}
