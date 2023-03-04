import { escape, escapeId } from "@/DatabaseUtils";
import { Expression } from "@/Expression";
import type * as ColumnOptions from "@/Schema/ColumnOptions";
import { ColumnType } from "@/Schema/ColumnType";
import { isScalarNullable } from "@/Types";

const typesDefaultPK: ColumnOptions.All = {
  autoIncrement: true,
  unsigned: true,
  primaryKey: true,
  nullable: false,
  default: undefined,
};

const typesDefaultOptions: Partial<Record<ColumnType, ColumnOptions.All>> = {
  // Primary keys types.
  [ColumnType.PK]: typesDefaultPK,
  [ColumnType.BIGPK]: typesDefaultPK,
};

export class Column<T extends ColumnOptions.All = ColumnOptions.All> {
  public options: ColumnOptions.All;

  public constructor(
    public name: string,
    public type: ColumnType,
    options?: T
  ) {
    this.options = {
      default: Expression.NULL,
      ...(typesDefaultOptions[type] ?? {}),
      ...(options ?? {}),
    };
  }

  public static create(
    name: string,
    type: ColumnType.BIGPK | ColumnType.PK,
    options?: ColumnOptions.Basic
  ): Column<ColumnOptions.Basic>;

  public static create(
    name: string,
    type:
      | ColumnType.BIGINT
      | ColumnType.DOUBLE
      | ColumnType.FLOAT
      | ColumnType.INT
      | ColumnType.MEDIUMINT
      | ColumnType.SMALLINT
      | ColumnType.TINYINT,
    options?: ColumnOptions.General & ColumnOptions.Unsigned
  ): Column<ColumnOptions.General & ColumnOptions.Unsigned>;

  public static create(
    name: string,
    type: ColumnType.BIT,
    options?: ColumnOptions.Bits & ColumnOptions.General
  ): Column<ColumnOptions.Bits & ColumnOptions.General>;

  public static create(
    name: string,
    type: ColumnType.DECIMAL,
    options?: ColumnOptions.General &
      ColumnOptions.Precision &
      ColumnOptions.Unsigned
  ): Column<
    ColumnOptions.General & ColumnOptions.Precision & ColumnOptions.Unsigned
  >;

  public static create(
    name: string,
    type:
      | ColumnType.JSON
      | ColumnType.LONGTEXT
      | ColumnType.MEDIUMTEXT
      | ColumnType.TEXT
      | ColumnType.TINYTEXT,
    options?: ColumnOptions.Collate & ColumnOptions.General
  ): Column<ColumnOptions.Collate & ColumnOptions.General>;

  public static create(
    name: string,
    type: ColumnType.CHAR | ColumnType.VARCHAR,
    options?: ColumnOptions.Collate &
      ColumnOptions.General &
      ColumnOptions.Length
  ): Column<
    ColumnOptions.Collate & ColumnOptions.General & ColumnOptions.Length
  >;

  public static create(
    name: string,
    type:
      | ColumnType.BLOB
      | ColumnType.DATE
      | ColumnType.LONGBLOB
      | ColumnType.MEDIUMBLOB
      | ColumnType.TINYBLOB
      | ColumnType.YEAR,
    options?: ColumnOptions.General
  ): Column<ColumnOptions.General>;

  public static create(
    name: string,
    type: ColumnType.BINARY | ColumnType.VARBINARY,
    options?: ColumnOptions.General & ColumnOptions.Length
  ): Column<ColumnOptions.General & ColumnOptions.Length>;

  public static create(
    name: string,
    type: ColumnType.DATETIME | ColumnType.TIME | ColumnType.TIMESTAMP,
    options?: ColumnOptions.General & ColumnOptions.Temporal
  ): Column<ColumnOptions.General & ColumnOptions.Temporal>;

  public static create(
    name: string,
    type: ColumnType.ENUM | ColumnType.SET,
    options?: ColumnOptions.Collate &
      ColumnOptions.General &
      ColumnOptions.Options
  ): Column<
    ColumnOptions.Collate & ColumnOptions.General & ColumnOptions.Options
  >;

  public static create<T extends ColumnOptions.All>(
    name: string,
    type: ColumnType,
    options?: T
  ): Column<T> {
    return new Column(name, type, options);
  }

  /**
   * Returns a column as SQL schema.
   * @example `id` INT UNSIGNED...
   */
  public asCreateSchema() {
    const components = [escapeId(this.name), this.getTypeSchema()];

    if (this.options.unsigned === true) {
      components.push("UNSIGNED");
    }

    if (this.options.collate !== undefined) {
      components.push(`COLLATE ${escapeId(this.options.collate)}`);
    }

    let defaultValue = this.options.default;

    if (this.options.nullable === false) {
      components.push("NOT NULL");

      if (
        defaultValue instanceof Expression &&
        defaultValue.expression === "NULL"
      ) {
        defaultValue = undefined;
      }
    }

    if (this.options.invisible === true) {
      components.push("INVISIBLE");
    }

    if (defaultValue !== undefined) {
      if (isScalarNullable(defaultValue)) {
        components.push(`DEFAULT ${escape(defaultValue)}`);
      } else {
        components.push(`DEFAULT ${defaultValue.expression}`);
      }
    }

    if (this.options.onUpdate !== undefined) {
      components.push(`ON UPDATE ${this.options.onUpdate.expression}`);
    }

    if (this.options.autoIncrement === true) {
      components.push("AUTO_INCREMENT");
    }

    if (this.options.comment !== undefined) {
      components.push(`COMMENT ${escape(this.options.comment)}`);
    }

    return components.join(" ");
  }

  /** Returns the corresponding SQL schema ColumnType. */
  private getTypeSchema(): string {
    switch (this.type) {
      case ColumnType.PK:
        return ColumnType.INT;

      case ColumnType.BIGPK:
        return ColumnType.BIGINT;

      case ColumnType.CHAR:
      case ColumnType.VARCHAR:
      case ColumnType.BINARY:
      case ColumnType.VARBINARY:
        return `${this.type}(${this.options.length ?? 255})`;

      case ColumnType.DECIMAL: {
        const precision = (this.options.precision ?? 10) || 10;

        if (precision === 10 && this.options.scale === undefined) {
          return this.type;
        }

        if (precision === 10) {
          return `${this.type}(10,${this.options.scale})`;
        }

        return `${this.type}(${precision})`;
      }

      case ColumnType.TIME:
      case ColumnType.DATETIME:
      case ColumnType.TIMESTAMP:
        if (this.options.microsecondPrecision !== undefined) {
          return `${this.type}(${this.options.microsecondPrecision})`;
        }
        break;

      case ColumnType.BIT:
        if (this.options.bits !== undefined) {
          return `${this.type}(${this.options.bits})`;
        }
        break;

      case ColumnType.ENUM:
      case ColumnType.SET: {
        const options = this.options.options ?? [""];

        return `${this.type}(${options
          .map((option) => escape(option))
          .join(",")})`;
      }

      default:
        break;
    }

    return this.type;
  }
}
