export declare class Expression {
    expression: string;
    /** A simple default NULL SQL expression. */
    static NULL: Expression;
    /** A simple default NOW() call SQL expression. */
    static NOW: Expression;
    /** Expression are raw SQL codes that must be used "as is". */
    constructor(expression: string);
}
