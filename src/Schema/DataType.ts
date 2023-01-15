export enum DataType {
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

export type DataTypePK = DataType.BIGPK | DataType.PK;

export type DataTypeInteger =
  | DataType.BIGINT
  | DataType.BIT
  | DataType.INT
  | DataType.MEDIUMINT
  | DataType.SMALLINT
  | DataType.TINYINT;

export type DataTypeFloat = DataType.DECIMAL | DataType.DOUBLE | DataType.FLOAT;

export type DataTypeStringText =
  | DataType.JSON
  | DataType.LONGTEXT
  | DataType.MEDIUMTEXT
  | DataType.TEXT
  | DataType.TINYTEXT;

export type DataTypeStringChar = DataType.CHAR | DataType.VARCHAR;

export type DataTypeBinaryText =
  | DataType.BLOB
  | DataType.LONGBLOB
  | DataType.MEDIUMBLOB
  | DataType.TINYBLOB;

export type DataTypeBinaryChar = DataType.BINARY | DataType.VARBINARY;

export type DataTypeTemporal = DataType.DATE | DataType.YEAR;

export type DataTypeTemporalExtended =
  | DataType.DATETIME
  | DataType.TIME
  | DataType.TIMESTAMP
  | DataTypeTemporal;

export type DataTypeList = DataType.ENUM | DataType.SET;
