/**
 * Holds information to describe the account relationship for an order or quote.
 */
export interface AccountInfo {
    /**
     * The Bill To Account.
     */
    BillToAccountId: string;
    /**
     * The Ship To Account.
     */
    ShipToAccountId: string;
    /**
     * The Sold To Account.
     */
    SoldToAccountId: string;
}