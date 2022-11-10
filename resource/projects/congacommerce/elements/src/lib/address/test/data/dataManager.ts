import { AccountLocation, Account, Contact, Address } from "@congacommerce/ecommerce";
import { AddressComponent } from "@congacommerce/elements";

const accountlocationValue= new AccountLocation();
accountlocationValue.Name='Name';
accountlocationValue.Country='Country';
accountlocationValue.State='State';
accountlocationValue.PostalCode=560009;

const address2: Address={
    'city': 'cityDemo',
    'country': null,
    'countryCode': 'valueDemo',
    'geocodeAccuracy': 1,
    'latitude': 1,
    'longitude': 1,
    'postalCode': 'valueDemo',
    'state': 'valueDemo',
    'stateCode': 'valueDemo',
    'street': 'valueDemo'
}

const address3: Address={
    'city': 'cityDemo',
    'country': 'countryDemo',
    'countryCode': 'valueDemo',
    'geocodeAccuracy': 1,
    'latitude': 1,
    'longitude': 1,
    'postalCode': 'valueDemo',
    'state': 'valueDemo',
    'stateCode': 'valueDemo',
    'street': 'valueDemo'
}

const accountValue= new Account()
accountValue.ShippingStateCode='peachroad';

const contactValue = new Contact();
contactValue.FirstName='test'
contactValue.LastName='user'
contactValue.MailingCountryCode='MSD'

const address: Address =

{
    'city': 'cityDemo',
    'country': 'valueDemo',
    'countryCode': 'valueDemo',
    'geocodeAccuracy': 1,
    'latitude': 1,
    'longitude': 1,
    'postalCode': 'valueDemo',
    'state': 'valueDemo',
    'stateCode': 'valueDemo',
    'street': 'valueDemo'
}

const parent={
    'label':'CountryDemo',
    'value':'DCountry'

}
const child={
    'label':'StateDemo',
    'value':'DState'
}
export { accountlocationValue, accountValue, contactValue, parent, child, address, address2, address3};