import type { PoolConnection } from "mariadb";

import { DatabaseBase } from "@/DatabaseBase";

export class DatabaseConnection extends DatabaseBase {
  public constructor(public readonly connection: PoolConnection) {
    super();
  }

  /** Release the connection. */
  public release() {
    this.connection.release();
  }
}
