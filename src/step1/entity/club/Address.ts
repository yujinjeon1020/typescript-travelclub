import AddressType from "./AddressType";

class Address {

    zipCode: string = '';
    zipAddress: string = '';
    streetAddress: string = '';
    country: string = 'South Korea';
    addressType: AddressType = AddressType.Office;          //enum

    constructor(zipCode: string, zipAddress: string, streetAddress: string) {
        this.zipCode = zipCode;
        this.zipAddress = zipAddress;
        this.streetAddress = streetAddress;
    }

    static getHomeAddressSample(): Address {
        const address: Address = new Address('134-321', 'Geumchoen-gu, gasan-dong', '231');
        address.addressType = AddressType.Home;         //enum
        return address;
    }
}

export default Address;