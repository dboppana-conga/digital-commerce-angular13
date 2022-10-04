
import { User } from "../../classes/index";
import { Account, AccountLocation} from "../../classes/index";
/**
 * @ignore
 */
export const accountLocation = [{
    'Id' :'1',
    'Name': 'trail',
    'City':'bangalore',
    'Country':'India',
    'PostalCode':'560093',
    'State': 'Macao',
    'Street': 'blue pearl',
    'IsDefault': false,
    'Account': null
}, {
    'Id' :'1',
    'Name': 'trail',
    'City':'bangalore',
    'Country':'India',
    'PostalCode':'560093',
    'State': 'Macao',
    'Street': 'blue pearl',
    'IsDefault': true,
    'Account': {
        'Id':'123'
    }
}] as unknown as Array<AccountLocation>;

/**
 * @ignore
 */
const account = new Account();
    account.Parent =  null;
    account.Industry =  "Retail";
    account.Phone =  555555;
    account.ShippingCountryCode =  "US";;
    account.ShippingStateCode =  "SC";
    account.ShippingCountry =  "United States";
    account.ShippingPostalCode =  "29910";
    account.ShippingState =  "South Carolina";
    account.ShippingCity =  "CA";
    account.ShippingAddress = {
        city: "867 main",
        country: "India",
        countryCode: '570023',
        geocodeAccuracy:456 ,
        latitude: 0,
        longitude: 0,
        postalCode: '123',
        state: 'Karnataka',
        stateCode: '123',
        street: 'street1'
    };
    account.ShippingStreet =  "9841 Cedar St.";
    account.BillingCountryCode =  "US";
    account.BillingStateCode =  "AZ";
    account.BillingCountry =  "United States";
    account.BillingPostalCode =  "85705";
    account.BillingState =  "Arizona";
    account.BillingCity =  "CA";
    account.BillingAddress =    {
        city: "1234 main",
        country: "India",
        countryCode: '570023',
        geocodeAccuracy:456 ,
        latitude: 0,
        longitude: 0,
        postalCode: '123',
        state: 'Karnataka',
        stateCode: '123',
        street: 'street1'
    };
    account.BillingStreet =  "799 E DRAGRAM SUITE 5A";
    account.Name =  "ABC Corporation Pcom";
    account.Id =  "546";


export { account };
/**
 * @ignore
 */
export const listAccount = [{
    "PriceList": {
        "Id": "a171T000005il1XQAQ"
    },
    "Owner": {
        "Id": "00550000000vtlpAAA"
    },
    "Parent": null,
    "Industry": "Retail",
    "Phone": "(211) 555-5555",
    "ShippingCountryCode": "US",
    "ShippingStateCode": "SC",
    "ShippingCountry": "United States",
    "ShippingPostalCode": "29910",
    "ShippingState": "South Carolina",
    "ShippingCity": "CA",
    "ShippingAddress": "867 main",
    "ShippingStreet": "9841 Cedar St.",
    "BillingCountryCode": "US",
    "BillingStateCode": "AZ",
    "BillingCountry": "United States",
    "BillingPostalCode": "85705",
    "BillingState": "Arizona",
    "BillingCity": "CA",
    "BillingAddress": "1234 main",
    "BillingStreet": "799 E DRAGRAM SUITE 5A",
    "Name": "ABC Corporation Pcom",
    "Id": "546"
}] as unknown as Array<Account>;
/**
 * @ignore
 */
export const Users={
    "FirstName": "test",
    "LastName": "user",
    "Email": "testuser@conga.com",
    "Alias": "guest",
    "Name": "testuser",
    "LocaleSidKey": "en_US",
    "EmailEncodingKey": "UTF-8",
    "Language": null,
    "CountryCode": "US",
    "TimeZoneSidKey": "testusercom",
    "CurrencyIsoCode": "USD",
    "Locale":null
} as User;
/**
 * @ignore
 */
export const User1={
    "FirstName": "test",
    "LastName": "user1",
    "Email": "testuser@conga.com",
    "Alias": "guest",
    "Name": "testuser1",
    "LocaleSidKey": "en_US",
    "EmailEncodingKey": "UTF-8",
    "Language": "en-US",
    "CountryCode": "US",
    "TimeZoneSidKey": "testusercom",
    "CurrencyIsoCode": "USD"
} as User;

/**
 * @ignore
 */
const User2 = new User();
User2.FirstName = "test";
User2.Id ="123",
User2.LastName = "user";
User2.Email = "testuser@conga.com";
User2.Alias = "logged in";
User2.Name = "testuser";
User2.LocaleSidKey = "en_US";
User2.EmailEncodingKey = "UTF-8";
User2.Language = "en_US";
User2.CountryCode = "US";
User2.TimeZoneSidKey = "testusercom";
User2.CurrencyIsoCode = "USD";

export { User2 };


/**
 * @ignore
 */
export const UserLocale='{"DisplayName":"English (United States)","Name":"en-US","NumberFormat":{"DecimalSymbol":".","DigitGroup":"123,456,789.00","DigitGroupingSymbol":",","NegativeNumberFormat":"- n"},"DateFormat":{"LongDateFormat":"dddd, MMMM d, yyyy","ShortDateFormat":"M/d/yyyy","TimeFormat":"h:mm tt"}}' as string;

