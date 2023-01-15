// Reference: https://mariadb.com/kb/en/result-set-packets/#field-details-flag.
export const enum ColumnDefinitionFlag {
  NOT_NULL = 1 << 0,
  PRIMARY_KEY = 1 << 1,
  UNIQUE_KEY = 1 << 2,
  MULTIPLE_KEY = 1 << 3,
  BLOB = 1 << 4,
  UNSIGNED = 1 << 5,
  ZEROFILL = 1 << 6,
  BINARY_COLLATION = 1 << 7,
  ENUM = 1 << 8,
  AUTO_INCREMENT = 1 << 9,
  TIMESTAMP = 1 << 10,
  SET = 1 << 11,
  NO_DEFAULT_VALUE = 1 << 12,
  ON_UPDATE_NOW = 1 << 13,
  NUM = 1 << 15,
}

// Reference: https://mariadb.com/kb/en/result-set-packets/#field-types.
export const enum ColumnDefinitionType {
  DECIMAL = 0,
  TINY = 1,
  SHORT = 2,
  INT = 3,
  FLOAT = 4,
  DOUBLE = 5,
  NULL = 6,
  TIMESTAMP = 7,
  BIGINT = 8,
  INT24 = 9,
  DATE = 10,
  TIME = 11,
  DATETIME = 12,
  YEAR = 13,
  NEWDATE = 14,
  VARCHAR = 15,
  BIT = 16,
  TIMESTAMP2 = 17,
  DATETIME2 = 18,
  TIME2 = 19,
  JSON = 245,
  NEWDECIMAL = 246,
  ENUM = 247,
  SET = 248,
  TINY_BLOB = 249,
  MEDIUM_BLOB = 250,
  LONG_BLOB = 251,
  BLOB = 252,
  VAR_STRING = 253,
  STRING = 254,
  GEOMETRY = 255,
}

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
