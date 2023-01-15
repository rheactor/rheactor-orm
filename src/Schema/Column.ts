import type { Database } from "@/Database";
import type {
  DataTypeBinaryChar,
  DataTypeBinaryText,
  DataTypeFloat,
  DataTypeInteger,
  DataTypeList,
  DataTypePK,
  DataTypeStringChar,
  DataTypeStringText,
  DataTypeTemporal,
  DataTypeTemporalExtended,
} from "@/Schema/DataType";
import { DataType } from "@/Schema/DataType";
import { isScalarNullable } from "@/Types";
import { Expression } from "./../Expression";

interface ColumnCreateOptions {
  /**
   * Column is nullable (NULL) or not (NOT NULL).
   * Default is `false` (NOT NULL).
   */
  nullable?: boolean;

  /** Column default value. */
  default?: Expression | boolean | number | string;

  /** Column ON UPDATE expression. */
  onUpdate?: Expression;

  /** Column is UNSIGNED. */
  unsigned?: boolean;

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

  /** Column character set. */
  characterSet?: string;

  /** Column collate. */
  collate?: string;

  /**
   * Column as INDEX.
   * If string, then it will be the index name.
   * If string[], then it will create a compound index.
   */
  index?: string[] | boolean | string;

  /**
   * Column as UNIQUE index.
   * If string, then it will be the index name.
   * If string[], then it will create a compound index.
   */
  unique?: string[] | boolean | string;

  /** Column is AUTO_INCREMENT. */
  autoIncrement?: boolean;

  /**
   * Column as PRIMARY KEY index.
   * If string[], then it will create a compound index.
   */
  primaryKey?: string[] | boolean;

  /**
   * Column as FULLTEXT index.
   * If string, then it will be the index name.
   * If string[], then it will create a compound index.
   */
  fullText?: string[] | boolean | string;

  /**
   * Column must be invisible to `SELECT *`.
   * Default is `false`.
   */
  invisible?: boolean;

  /** Column comment. */
  comment?: string;
}

/** Applicable to: PK, BIGPK. */
type ColumnCreateOptionsPK = Pick<ColumnCreateOptions, "comment" | "invisible">;

/** Applicable to general types. */
type ColumnCreateOptionsGeneral = ColumnCreateOptionsPK &
  Pick<
    ColumnCreateOptions,
    "default" | "index" | "invisible" | "nullable" | "unique"
  >;

/** Applicable to integers types. */
type ColumnCreateOptionsInteger = ColumnCreateOptionsGeneral &
  Pick<ColumnCreateOptions, "unsigned">;

/** Applicable to BIT type. */
type ColumnCreateOptionsIntegerBit = ColumnCreateOptionsGeneral &
  Pick<ColumnCreateOptions, "bits">;

/** Applicable to float types. */
type ColumnCreateOptionsFloat = ColumnCreateOptionsInteger;

/** Applicable to DECIMAL type. */
type ColumnCreateOptionsFloatDecimal = ColumnCreateOptionsFloat &
  Pick<ColumnCreateOptions, "precision" | "scale">;

/** Applicable to strings types (non-binary). */
type ColumnCreateOptionsStringText = ColumnCreateOptionsGeneral &
  Pick<ColumnCreateOptions, "characterSet" | "collate" | "fullText">;

/** Applicable to CHAR/VARCHAR types. */
type ColumnCreateOptionsStringChar = ColumnCreateOptionsStringText &
  Pick<ColumnCreateOptions, "length">;

/** Applicable to binary types. */
type ColumnCreateOptionsBinaryChar = ColumnCreateOptionsGeneral &
  Pick<ColumnCreateOptions, "length">;

/** Applicable to ENUM/SET types. */
type ColumnCreateOptionsList = ColumnCreateOptionsGeneral &
  Pick<ColumnCreateOptions, "characterSet" | "collate" | "options">;

/** Applicable to DATE/YEAR types. */
type ColumnCreateOptionsTemporal = ColumnCreateOptionsGeneral;

/** Applicable to temporal types. */
type ColumnCreateOptionsTemporalExtended = ColumnCreateOptionsTemporal &
  Pick<ColumnCreateOptions, "microsecondPrecision" | "onUpdate">;

export class Column<T extends ColumnCreateOptions> {
  public options: ColumnCreateOptions;

  public constructor(public name: string, public type: DataType, options?: T) {
    this.options = options ?? {};

    switch (type) {
      case DataType.PK:
      case DataType.BIGPK:
        this.options = {
          ...this.options,
          nullable: false,
          autoIncrement: true,
          unsigned: true,
          primaryKey: true,
        };
        break;

      default:
        break;
    }
  }

  /** Creates a PK/BIGPK column schema. */
  public static create(
    name: string,
    type: DataTypePK,
    options?: ColumnCreateOptionsPK
  ): Column<ColumnCreateOptionsPK>;

  /** Creates a integer column schema (except BIT). */
  public static create(
    name: string,
    type: Exclude<DataTypeInteger, DataType.BIT>,
    options?: ColumnCreateOptionsInteger
  ): Column<ColumnCreateOptionsInteger>;

  /** Creates a BIT column schema. */
  public static create(
    name: string,
    type: DataType.BIT,
    options?: ColumnCreateOptionsIntegerBit
  ): Column<ColumnCreateOptionsIntegerBit>;

  /** Creates a float column schema (except DECIMAL). */
  public static create(
    name: string,
    type: Exclude<DataTypeFloat, DataType.DECIMAL>,
    options?: ColumnCreateOptionsFloat
  ): Column<ColumnCreateOptionsFloat>;

  /** Creates a DECIMAL column schema. */
  public static create(
    name: string,
    type: DataType.DECIMAL,
    options?: ColumnCreateOptionsFloatDecimal
  ): Column<ColumnCreateOptionsFloatDecimal>;

  /** Creates a text column schema. */
  public static create(
    name: string,
    type: DataTypeStringText,
    options?: ColumnCreateOptionsStringText
  ): Column<ColumnCreateOptionsStringText>;

  /** Creates a CHAR/VARCHAR column schema. */
  public static create(
    name: string,
    type: DataTypeStringChar,
    options?: ColumnCreateOptionsStringChar
  ): Column<ColumnCreateOptionsStringChar>;

  /** Creates a binary column schema. */
  public static create(
    name: string,
    type: DataTypeBinaryText,
    options?: ColumnCreateOptionsGeneral
  ): Column<ColumnCreateOptionsGeneral>;

  /** Creates a BINARY/VARBINARY column schema. */
  public static create(
    name: string,
    type: DataTypeBinaryChar,
    options?: ColumnCreateOptionsBinaryChar
  ): Column<ColumnCreateOptionsBinaryChar>;

  /** Creates a binary/DATE/YEAR column schema. */
  public static create(
    name: string,
    type: DataTypeTemporal,
    options?: ColumnCreateOptionsTemporal
  ): Column<ColumnCreateOptionsTemporal>;

  /** Creates a DATE/YEAR column schema. */
  public static create(
    name: string,
    type: DataTypeTemporalExtended,
    options?: ColumnCreateOptionsTemporalExtended
  ): Column<ColumnCreateOptionsTemporalExtended>;

  /** Creates a ENUM/SEt column schema. */
  public static create(
    name: string,
    type: DataTypeList,
    options?: ColumnCreateOptionsList
  ): Column<ColumnCreateOptionsList>;

  /** Create a column schema. */
  public static create<T extends ColumnCreateOptions>(
    name: string,
    type: DataType,
    options?: T
  ): Column<T> {
    return new Column(name, type, options);
  }

  /**
   * Returns a column as SQL schema.
   * @example `id` INT UNSIGNED...
   */
  public asCreateSchema(database: Database) {
    const components = [
      database.escapeId(this.name),
      this.getTypeSchema(database),
    ];

    if (this.options.unsigned) {
      components.push("UNSIGNED");
    }

    if (this.options.nullable) {
      components.push("NULL");
    }

    if (this.options.default && isScalarNullable(this.options.default)) {
      components.push(
        `DEFAULT ${database.escape(String(this.options.default))}`
      );
    } else if (this.options.default instanceof Expression) {
      components.push(`DEFAULT ${this.options.default.expression}`);
    } else if (this.options.onUpdate) {
      components.push(`DEFAULT NULL`);
    }

    if (this.options.onUpdate) {
      components.push(`ON UPDATE ${this.options.onUpdate.expression}`);
    }

    if (this.options.autoIncrement) {
      components.push("AUTO_INCREMENT");
    }

    if (this.options.primaryKey) {
      components.push("PRIMARY KEY");
    }

    if (this.options.invisible) {
      components.push("INVISIBLE");
    }

    if (this.options.unique) {
      components.push("UNIQUE");
    }

    if (this.options.characterSet) {
      components.push(
        `CHARACTER SET ${database.escape(this.options.characterSet)}`
      );
    }

    if (this.options.collate) {
      components.push(`COLLATE ${database.escape(this.options.collate)}`);
    }

    if (this.options.comment) {
      components.push(`COMMENT ${database.escape(this.options.comment)}`);
    }

    return components.join(" ");
  }

  /** Returns the corresponding SQL schema DataType. */
  private getTypeSchema(database: Database): string {
    switch (this.type) {
      case DataType.PK:
        return DataType.INT;

      case DataType.BIGPK:
        return DataType.BIGINT;

      case DataType.BIT:
        if (this.options.bits) {
          return `${this.type}(${this.options.bits})`;
        }
        break;

      case DataType.CHAR:
      case DataType.VARCHAR:
      case DataType.BINARY:
      case DataType.VARBINARY:
        return `${this.type}(${this.options.length ?? 255})`;

      case DataType.DECIMAL:
        if (this.options.precision && this.options.scale) {
          return `${this.type}(${this.options.precision},${this.options.scale})`;
        } else if (this.options.precision) {
          return `${this.type}(${this.options.precision})`;
        } else if (this.options.scale) {
          return `${this.type}(10,${this.options.scale})`;
        }
        break;

      case DataType.TIME:
      case DataType.DATETIME:
      case DataType.TIMESTAMP:
        if (this.options.microsecondPrecision) {
          return `${this.type}(${this.options.microsecondPrecision})`;
        }
        break;

      case DataType.ENUM:
      case DataType.SET: {
        const options = this.options.options ?? [""];

        return `${this.type}(${options
          .map((option) => database.escape(option))
          .join(",")})`;
      }

      default:
        break;
    }

    return this.type;
  }
}
