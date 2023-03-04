// Reference: https://mariadb.com/kb/en/result-set-packets/#field-details-flag.
// https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/0b6b64ace271d60245823b411c98e29d5faf5e87/types/index.d.ts#L882
export const enum ColumnDefinitionFlag {
  NOT_NULL = 1,
  PRIMARY_KEY = 2,
  UNIQUE_KEY = 4,
  MULTIPLE_KEY = 8,
  BLOB = 1 << 4,
  UNSIGNED = 1 << 5,
  ZEROFILL_FLAG = 1 << 6,
  BINARY_COLLATION = 1 << 7,
  ENUM = 1 << 8,
  AUTO_INCREMENT = 1 << 9,
  TIMESTAMP = 1 << 10,
  SET = 1 << 11,
  NO_DEFAULT_VALUE_FLAG = 1 << 12,
  ON_UPDATE_NOW_FLAG = 1 << 13,
  NUM_FLAG = 1 << 14,
}
