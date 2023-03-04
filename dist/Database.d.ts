import type { Pool } from "mariadb";
import { DatabaseBase } from "./DatabaseBase";
import { DatabaseConnection } from "./DatabaseConnection";
interface DatabaseCreateConnectionOptions {
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
export declare class Database extends DatabaseBase {
    readonly options: DatabaseCreateConnectionOptions;
    readonly connection: Pool;
    private constructor();
    /** Creates a new Database connection. */
    static createConnection(options: DatabaseCreateConnectionOptions): Database;
    getSingleConnection(): Promise<DatabaseConnection>;
    /** Closes connection. */
    close(): void;
}
export {};
