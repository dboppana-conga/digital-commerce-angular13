
import { PriceList, Cart } from "@congacommerce/ecommerce";
import { User } from "../../classes/index";
import { Account, AccountLocation } from "../../classes/index";
/**
 * @ignore
 */
export const accountLocation = [{
    'Id': '1',
    'Name': 'trail',
    'City': 'bangalore',
    'Country': 'India',
    'PostalCode': '560093',
    'State': 'Macao',
    'Street': 'blue pearl',
    'IsDefault': false,
    'Account': null
}, {
    'Id': '1',
    'Name': 'trail',
    'City': 'bangalore',
    'Country': 'India',
    'PostalCode': '560093',
    'State': 'Macao',
    'Street': 'blue pearl',
    'IsDefault': true,
    'Account': {
        'Id': '123'
    }
}] as unknown as Array<AccountLocation>;

/**
 * @ignore
 */
const accountValue = new Account();
accountValue.Parent = null;
accountValue.Industry = "Retail";
accountValue.Phone = 555555;
accountValue.ShippingCountryCode = "US";;
accountValue.ShippingStateCode = "SC";
accountValue.ShippingCountry = "United States";
accountValue.ShippingPostalCode = "29910";
accountValue.ShippingState = "South Carolina";
accountValue.ShippingCity = "CA";
accountValue.ShippingAddress = {
    city: "867 main",
    country: "India",
    countryCode: '570023',
    geocodeAccuracy: 456,
    latitude: 0,
    longitude: 0,
    postalCode: '123',
    state: 'Karnataka',
    stateCode: '123',
    street: 'street1'
};
accountValue.ShippingStreet = "9841 Cedar St.";
accountValue.BillingCountryCode = "US";
accountValue.BillingStateCode = "AZ";
accountValue.BillingCountry = "United States";
accountValue.BillingPostalCode = "85705";
accountValue.BillingState = "Arizona";
accountValue.BillingCity = "CA";
accountValue.BillingAddress = {
    city: "1234 main",
    country: "India",
    countryCode: '570023',
    geocodeAccuracy: 456,
    latitude: 0,
    longitude: 0,
    postalCode: '123',
    state: 'Karnataka',
    stateCode: '123',
    street: 'street1'
};
accountValue.PriceList = {
    Id: '12345'
} as unknown as PriceList;
accountValue.BillingStreet = "799 E DRAGRAM SUITE 5A";
accountValue.Name = "ABC Corporation Pcom";
accountValue.Id = "546";

const accountData = new Account();
accountData.Id = "55555";
accountData.Phone = 554555;
accountData.ShippingCountryCode = "US";;
accountData.ShippingStateCode = "SC";
accountData.ShippingCountry = "United States";
accountData.ShippingPostalCode = "29910";
accountData.ShippingState = "South Carolina";

const CARTS = new Cart()
CARTS.Id = "aEIOU",
    CARTS.Name = "a1I790000007Vdq"

export { accountValue, accountData, CARTS };
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
export const Users = {
    "Id": "12345",
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
    "Locale": null
} as User;
/**
 * @ignore
 */
export const User1 = {
    "FirstName": "test",
    "LastName": "user1",
    "Email": "testuser@conga.com",
    "Alias": "guest",
    "Name": "testuser1",
    "Id": "c1d05a85-26b9-4033",
    "LocaleSidKey": "en_US",
    "EmailEncodingKey": "UTF-8",
    "Language": "en-US",
    "CountryCode": "US",
    "TimeZoneSidKey": "testusercom",
    "CurrencyIsoCode": "USD"
} as User;

export const User3 = {
    "FirstName": "test"
} as User;

/**
 * @ignore
 */
const User2 = new User();
User2.FirstName = "test";
User2.Id = "123",
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

User2.FirstName = "test";
export { User2 };


/**
 * @ignore
 */
export const UserLocale = '{"DisplayName":"English (United States)","Name":"en-US","NumberFormat":{"DecimalSymbol":".","DigitGroup":"123,456,789.00","DigitGroupingSymbol":",","NegativeNumberFormat":"- n"},"DateFormat":{"LongDateFormat":"dddd, MMMM d, yyyy","ShortDateFormat":"M/d/yyyy","TimeFormat":"h:mm tt"}}' as string;

const ACCOUNT_INFO = new Account();
ACCOUNT_INFO.Parent = null;
ACCOUNT_INFO.Industry = "Retail";
ACCOUNT_INFO.Phone = 555555;
ACCOUNT_INFO.ShippingCountryCode = "US";;
ACCOUNT_INFO.ShippingStateCode = "SC";
ACCOUNT_INFO.ShippingCountry = "United States";
ACCOUNT_INFO.ShippingPostalCode = "29910";
ACCOUNT_INFO.ShippingState = "South Carolina";
ACCOUNT_INFO.ShippingCity = "CA";
ACCOUNT_INFO.ShippingAddress = {
    city: "867 main",
    country: "India",
    countryCode: '570023',
    geocodeAccuracy: 456,
    latitude: 0,
    longitude: 0,
    postalCode: '123',
    state: 'Karnataka',
    stateCode: '123',
    street: 'street1'
};
ACCOUNT_INFO.ShippingStreet = "9841 Cedar St.";
ACCOUNT_INFO.BillingCountryCode = "US";
ACCOUNT_INFO.BillingStateCode = "AZ";
ACCOUNT_INFO.BillingCountry = "United States";
ACCOUNT_INFO.BillingPostalCode = "85705";
ACCOUNT_INFO.BillingState = "Arizona";
ACCOUNT_INFO.BillingCity = "CA";
ACCOUNT_INFO.BillingAddress = {
    city: "1234 main",
    country: "India",
    countryCode: '570023',
    geocodeAccuracy: 456,
    latitude: 0,
    longitude: 0,
    postalCode: '123',
    state: 'Karnataka',
    stateCode: '123',
    street: 'street1'
};
ACCOUNT_INFO.PriceList = {
    Id: '12345'
} as unknown as PriceList;
ACCOUNT_INFO.BillingStreet = "799 E DRAGRAM SUITE 5A";
ACCOUNT_INFO.Name = "ABC Corporation Pcom";
ACCOUNT_INFO.Id = "546";

export { ACCOUNT_INFO };