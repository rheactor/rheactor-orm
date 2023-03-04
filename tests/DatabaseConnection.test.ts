import { createConnection, databaseName } from "@Tests/Test/DatabaseConnection";

describe("Database", () => {
  const connection = createConnection();

  afterAll(() => {
    connection.close();
  });

  test("DatabaseConnection.execute()", async () => {
    expect.assertions(3);

    const result = await connection.execute(`USE \`${databaseName}\``);

    expect(result.affectedRows).toBe(0);
    expect(result.insertId).toBe(0n);
    expect(result.warningStatus).toBe(0);
  });
});
