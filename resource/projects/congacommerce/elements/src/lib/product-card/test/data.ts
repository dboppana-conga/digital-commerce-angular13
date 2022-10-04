import { Account, Cart, Product, Quote, Storefront } from "@congacommerce/ecommerce";

export const STOREFRONT = {
    Name: "D-Commerce",
    DefaultPriceList: "tier1",
    Logo: 'logo.png',
    EnableABO: false,
    DefaultAccountforGuestUsers: "guestuser",
    ChannelType: 'Partner Commerce',
    ConfigurationLayout: 'Native',
    EnableTaxCalculations: false,
} as unknown as Storefront;


const ACCOUNT = new Account();
ACCOUNT.Parent = null;
ACCOUNT.Industry = "Retail";
ACCOUNT.Phone = 555555;
ACCOUNT.ShippingCountryCode = "US";;
ACCOUNT.ShippingStateCode = "SC";
ACCOUNT.ShippingCountry = "United States";
ACCOUNT.ShippingPostalCode = "29910";
ACCOUNT.ShippingState = "South Carolina";
ACCOUNT.ShippingCity = "CA";
ACCOUNT.ShippingAddress = {
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
ACCOUNT.ShippingStreet = "9841 Cedar St.";
ACCOUNT.BillingCountryCode = "US";
ACCOUNT.BillingStateCode = "AZ";
ACCOUNT.BillingCountry = "United States";
ACCOUNT.BillingPostalCode = "85705";
ACCOUNT.BillingState = "Arizona";
ACCOUNT.BillingCity = "CA";
ACCOUNT.BillingAddress = {
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
ACCOUNT.BillingStreet = "799 E DRAGRAM SUITE 5A";
ACCOUNT.Name = "ABC Corporation Pcom";
ACCOUNT.Id = "546";

export { ACCOUNT }


const quoteMockData = new Quote();
quoteMockData.Id = 'quote001';
quoteMockData.Name = 'Test Quote';


const CART_DATA = new Cart();
CART_DATA.Id = "72b194e9-3992-49ba-ae06-ea62f301f998";
CART_DATA.Name = "Test Cart";
CART_DATA.Account = ACCOUNT;
CART_DATA.Status = "New";
CART_DATA.Order = null;
CART_DATA.BusinessObjectType = "Agreement";
CART_DATA.IsTransient = true;
CART_DATA.Proposald = quoteMockData;

export { CART_DATA };


const PRODUCT_MOCK = new Product()
PRODUCT_MOCK.Name = "Temperature Calibration for PTU30T";
PRODUCT_MOCK.Id = "0ebb3fa0-59e5-472a-9678-62d45d5d0344";
PRODUCT_MOCK.Description = "One point temperature calibration at ambient. The service includes the instrument adjustment to meet its specification, calibration certificate, service report, functional testing and wearing parts.";
PRODUCT_MOCK.IsActive = true;
PRODUCT_MOCK.HasDefaults = false;

export { PRODUCT_MOCK }

export const PRODUCT_ARRAY = [
    {
        "Name": "Charger",
        "Id": "0ebb3fa0-59e5-472a-9678-62d45d5m0987",
        "Description": "One point temperature calibration at ambient. The service includes the instrument adjustment to meet its specification, calibration certificate, service report, functional testing and wearing parts.",
        "IsActive": true,
        "HasDefaults": false
    },
    {
        "Name": "Cloud server",
        "Id": "0ebb3fa0-59e5-472a-9678-62d45d5d0123",
        "Description": "lorem ipsum",
        "IsActive": true,
        "HasDefaults": false
    },
    {
        "Name": "Rakes",
        "Id": "0ebb3fa0-59e5-472a-9678-62d45d5d0456",
        "Description": "calibration certificate, service report, functional testing and wearing parts.",
        "IsActive": true,
        "HasDefaults": false
    }
] as Array<Product>