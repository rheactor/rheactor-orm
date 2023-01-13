import type { ColumnDefinition } from "@/Meta/ColumnDefinition";

export interface SelectResult<T> extends Array<T> {
  meta: ColumnDefinition[];
}
