import type { Pool } from "mariadb";
import { createPool } from "mariadb";

import { DatabaseBase } from "@/DatabaseBase";
import { DatabaseConnection } from "@/DatabaseConnection";

interface DatabaseCreateConnectionOptions {
  /**
   * Database hostname to connect to.
   * By default "127.0.0.1".
   */
  host?: string;

  /**
   * Database username to be used during the connection.
   * By default "root".
   */
  user?: string;

  /**
   * Database password to be used during the connection.
   * By default "" (empty string).
   */
  password?: string;

  /**
   * Database name to be used by this connection.
   * Required.
   */
  database: string;
}

export class Database extends DatabaseBase {
  private constructor(
    public readonly options: DatabaseCreateConnectionOptions,
    public readonly connection: Pool
  ) {
    super();
  }

  /** Creates a new Database connection. */
  public static createConnection(options: DatabaseCreateConnectionOptions) {
    return new Database(
      options,
      createPool({
        host: "127.0.0.1",
        user: "root",

        ...options,
      })
    );
  }

  public async getSingleConnection() {
    return new DatabaseConnection(await this.connection.getConnection());
  }

  /** Closes connection. */
  public close() {
    this.connection.end();
  }
}
