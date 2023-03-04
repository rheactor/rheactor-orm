import type * as ColumnOptions from "../Schema/ColumnOptions";
import { ColumnType } from "../Schema/ColumnType";
export declare class Column<T extends ColumnOptions.All = ColumnOptions.All> {
    name: string;
    type: ColumnType;
    options: ColumnOptions.All;
    constructor(name: string, type: ColumnType, options?: T);
    static create(name: string, type: ColumnType.BIGPK | ColumnType.PK, options?: ColumnOptions.Basic): Column<ColumnOptions.Basic>;
    static create(name: string, type: ColumnType.BIGINT | ColumnType.DOUBLE | ColumnType.FLOAT | ColumnType.INT | ColumnType.MEDIUMINT | ColumnType.SMALLINT | ColumnType.TINYINT, options?: ColumnOptions.General & ColumnOptions.Unsigned): Column<ColumnOptions.General & ColumnOptions.Unsigned>;
    static create(name: string, type: ColumnType.BIT, options?: ColumnOptions.Bits & ColumnOptions.General): Column<ColumnOptions.Bits & ColumnOptions.General>;
    static create(name: string, type: ColumnType.DECIMAL, options?: ColumnOptions.General & ColumnOptions.Precision & ColumnOptions.Unsigned): Column<ColumnOptions.General & ColumnOptions.Precision & ColumnOptions.Unsigned>;
    static create(name: string, type: ColumnType.JSON | ColumnType.LONGTEXT | ColumnType.MEDIUMTEXT | ColumnType.TEXT | ColumnType.TINYTEXT, options?: ColumnOptions.Collate & ColumnOptions.General): Column<ColumnOptions.Collate & ColumnOptions.General>;
    static create(name: string, type: ColumnType.CHAR | ColumnType.VARCHAR, options?: ColumnOptions.Collate & ColumnOptions.General & ColumnOptions.Length): Column<ColumnOptions.Collate & ColumnOptions.General & ColumnOptions.Length>;
    static create(name: string, type: ColumnType.BLOB | ColumnType.DATE | ColumnType.LONGBLOB | ColumnType.MEDIUMBLOB | ColumnType.TINYBLOB | ColumnType.YEAR, options?: ColumnOptions.General): Column<ColumnOptions.General>;
    static create(name: string, type: ColumnType.BINARY | ColumnType.VARBINARY, options?: ColumnOptions.General & ColumnOptions.Length): Column<ColumnOptions.General & ColumnOptions.Length>;
    static create(name: string, type: ColumnType.DATETIME | ColumnType.TIME | ColumnType.TIMESTAMP, options?: ColumnOptions.General & ColumnOptions.Temporal): Column<ColumnOptions.General & ColumnOptions.Temporal>;
    static create(name: string, type: ColumnType.ENUM | ColumnType.SET, options?: ColumnOptions.Collate & ColumnOptions.General & ColumnOptions.Options): Column<ColumnOptions.Collate & ColumnOptions.General & ColumnOptions.Options>;
    /**
     * Returns a column as SQL schema.
     * @example `id` INT UNSIGNED...
     */
    asCreateSchema(): string;
    /** Returns the corresponding SQL schema ColumnType. */
    private getTypeSchema;
}
