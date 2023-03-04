import type { Expression } from "../Expression";
export interface All {
    /**
     * Column is nullable (NULL) or not (NOT NULL).
     * Default is `false` (NOT NULL).
     */
    nullable?: boolean;
    /** Column default value. */
    default?: Expression | boolean | number | string;
    /** Column ON UPDATE NOW() expression. */
    onUpdateNow?: boolean;
    /** Column is UNSIGNED. */
    unsigned?: boolean;
    /** Apply zero padding to numeric columns. */
    zerofill?: boolean;
    /**
     * Column length,
     * @example VARCHAR(255) => 255
     */
    length?: number;
    /**
     * Column precision.
     * @example DECIMAL(10, 2) => 10
     */
    precision?: number;
    /**
     * Column scale.
     * @example DECIMAL(10, 2) => 2
     */
    scale?: number;
    /**
     * Column microsecond precision.
     * @example TIMESTAMP(6) => 6
     */
    microsecondPrecision?: number;
    /**
     * Column bits.
     * @example BIT(5) => 5
     */
    bits?: number;
    /**
     * Column options.
     * @example SET("a", "b", "c") => ["a", "b", "c"]
     */
    options?: string[];
    /** Column collate. */
    collate?: string;
    /** Column as KEY. */
    key?: boolean;
    /** Column as UNIQUE KEY. */
    uniqueKey?: boolean;
    /** Column as PRIMARY KEY. */
    primaryKey?: boolean;
    /** Column is AUTO_INCREMENT. */
    autoIncrement?: boolean;
    /** Column must be invisible to `SELECT *`. Default is `false`. */
    invisible?: boolean;
    /** Column comment. */
    comment?: string;
}
export type Basic = Pick<All, "comment" | "invisible">;
export type General = Basic & Pick<All, "default" | "invisible" | "key" | "nullable" | "uniqueKey">;
export type Unsigned = Pick<All, "unsigned">;
export type Zerofill = Pick<All, "zerofill">;
export type Bits = Pick<All, "bits">;
export type Precision = Pick<All, "precision">;
export type Scale = Pick<All, "scale">;
export type Collate = Pick<All, "collate">;
export type Length = Pick<All, "length">;
export type Options = Pick<All, "options">;
export type Temporal = Pick<All, "microsecondPrecision" | "onUpdateNow">;
