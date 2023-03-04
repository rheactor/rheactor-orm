export class Expression {
  /** A simple default NULL SQL expression. */
  public static NULL = new Expression("NULL");

  /** A simple default NOW() call SQL expression. */
  public static NOW = new Expression("NOW()");

  /** Expression are raw SQL codes that must be used "as is". */
  public constructor(public expression: string) {}
}
