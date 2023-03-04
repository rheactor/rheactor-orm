import type { ExecuteResult } from "./Meta/ExecuteResult";
import type { SelectResult } from "./Meta/SelectResult";
import type { ScalarNullable } from "./Types";
import type { Pool, PoolConnection } from "mariadb";
export declare abstract class DatabaseBase {
    readonly connection: Pool | PoolConnection;
    /** Run a SELECT query using current database connection. */
    query<T extends object>(sql: string, values?: ScalarNullable[]): Promise<SelectResult<T>>;
    /**
     * Run a DML query using current database connection.
     * Example: INSERT, UPDATE and DELETE.
     */
    execute(sql: string, values?: ScalarNullable[]): Promise<ExecuteResult>;
}
