import type { PoolConnection } from "mariadb";
import { DatabaseBase } from "./DatabaseBase";
export declare class DatabaseConnection extends DatabaseBase {
    readonly connection: PoolConnection;
    constructor(connection: PoolConnection);
    /** Release the connection. */
    release(): void;
}
