/// <reference types="node" />
import type { DatabaseBase } from "./DatabaseBase";
import type { Column } from "./Schema/Column";
import type { ScalarNullable } from "./Types";
/**
 * Escapes ID.
 * @see https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/0b6b64ace271d60245823b411c98e29d5faf5e87/lib/misc/utils.js#L87
 */
export declare const escapeId: (value: string) => string;
/**
 * Escapes a scalar type.
 * @see https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/0b6b64ace271d60245823b411c98e29d5faf5e87/lib/misc/utils.js#L109
 */
export declare const escape: (value: Buffer | Date | ScalarNullable) => string;
/** Drop a table. */
export declare const dropTable: (connection: DatabaseBase, table: string) => void;
/** Run SHOW CREATE TABLE to a table. */
export declare const showCreate: (connection: DatabaseBase, table: string) => Promise<string>;
/** Creates a table. */
export declare const createTable: (connection: DatabaseBase, table: string, columns: Array<Column<object>>, options?: {
    comment?: string;
    collate?: string;
    temporary?: boolean;
}) => Promise<void>;
