import type { ExecuteResult } from "@/Meta/ExecuteResult";
import type { SelectResult } from "@/Meta/SelectResult";
import type { ScalarNullable } from "@/Types";
import type { Pool, PoolConnection } from "mariadb";

export abstract class DatabaseBase {
  public readonly connection!: Pool | PoolConnection;

  /** Run a SELECT query using current database connection. */
  public async query<T extends object>(
    sql: string,
    values?: ScalarNullable[]
  ): Promise<SelectResult<T>> {
    return this.connection.query(sql, values);
  }

  /**
   * Run a DML query using current database connection.
   * Example: INSERT, UPDATE and DELETE.
   */
  public async execute(
    sql: string,
    values?: ScalarNullable[]
  ): Promise<ExecuteResult> {
    return this.connection.query(sql, values);
  }
}
