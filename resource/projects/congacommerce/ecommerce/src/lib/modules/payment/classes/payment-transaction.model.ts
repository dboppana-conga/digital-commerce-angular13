export class PaymentTransaction  {
    Currency: string = null;    
    CustomerFirstName: string = null;
    CustomerLastName: string = null;
    CustomerEmailAddress: string = null;
    CustomerAddressLine1: string = null;
    CustomerAddressCity: string = null;
    CustomerAddressStateCode: string = null;
    CustomerAddressCountryCode: string = null;
    CustomerAddressPostalCode: string = null;
    CustomerBillingAccountName: string = null;
    CustomerBillingAccountID: string = null;
    OrderAmount: string = '0';
    PaymentToken: string = null;
    Locale: string = null;
    PaymentType: string = null;
    isUserLoggedIn: boolean = null;
    OrderGeneratedID: string = null;
    OrderName: string = null;
}
