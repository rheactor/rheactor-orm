import type { ColumnDefinitionFlag } from "../Meta/ColumnDefinitionFlag";
import type { ColumnDefinitionType } from "../Meta/ColumnDefinitionType";
export interface ColumnDefinition {
    /**
     * Column length.
     * @example VARCHAR(32) will be 32.
     */
    columnLength: number;
    /** Column type. */
    columnType: ColumnDefinitionType;
    /** Column flags. */
    flags: ColumnDefinitionFlag;
    /**
     * Column type scale.
     * @example DECIMAL(10, 2) will be 2.
     * @example DATETIME(6) will be 6.
     */
    scale: number;
}
