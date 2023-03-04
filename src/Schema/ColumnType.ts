export enum ColumnType {
  // Primary Key types.
  PK = "PK",
  BIGPK = "BIGPK",

  // Integer types.
  TINYINT = "TINYINT",
  SMALLINT = "SMALLINT",
  MEDIUMINT = "MEDIUMINT",
  INT = "INT",
  BIGINT = "BIGINT",
  BIT = "BIT",

  // Float types.
  DECIMAL = "DECIMAL",
  FLOAT = "FLOAT",
  DOUBLE = "DOUBLE",

  // String types.
  CHAR = "CHAR",
  VARCHAR = "VARCHAR",
  TINYTEXT = "TINYTEXT",
  TEXT = "TEXT",
  MEDIUMTEXT = "MEDIUMTEXT",
  LONGTEXT = "LONGTEXT",

  // Binary types.
  BINARY = "BINARY",
  VARBINARY = "VARBINARY",
  TINYBLOB = "TINYBLOB",
  BLOB = "BLOB",
  MEDIUMBLOB = "MEDIUMBLOB",
  LONGBLOB = "LONGBLOB",

  // Temporal types.
  DATE = "DATE",
  TIME = "TIME",
  YEAR = "YEAR",
  DATETIME = "DATETIME",
  TIMESTAMP = "TIMESTAMP",

  // Other types.
  JSON = "JSON",
  ENUM = "ENUM",
  SET = "SET",
}
