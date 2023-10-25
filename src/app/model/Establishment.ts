
export class Establishment {
	estIdentifyingKey: number;
	estName: string;
	status: string;
	estEmailId: string;
	estContactNumber: string;
	addressLine1: string;
	deletedOn: Date;
	state: string;
	country: string;
	city: string;
	createdOn: Date;
	addressLine2: string;
	zipcode: string;
	estFeedbackEmailId: string;
	estBrandName: string;
	estCountryIsoCode: string;
	estCountryIsdCode: string;

	constructor() {
		this.estIdentifyingKey = 0;
		this.estName = null;
		this.status = null;
		this.estEmailId = null;
		this.estContactNumber = null;
		this.addressLine1 = null;
		this.createdOn = new Date();
		this.deletedOn = null;
		this.state = null;
		this.country = null;
		this.city = null;
		this.addressLine2 = null;
		this.zipcode = null;
		this.estFeedbackEmailId = null;
		this.estBrandName = null;
		this.estCountryIsoCode = null;
		this.estCountryIsdCode = null;
	}

	setId(estIdentifyingKey: number) {
		this.estIdentifyingKey = estIdentifyingKey;
	}

	setEstName(estName: string) {
		this.estName = estName;
	}

	setLastName(status: string) {
		this.status = status;
	}

	setEmail(estEmailId: string) {
		this.estEmailId = estEmailId;
	}
	setContact(estContactNumber: string) {
		this.estContactNumber = estContactNumber;
	}
	setAddress(addressLine1: string) {
		this.addressLine1 = addressLine1;
	}
	setDeletedDate(deletedOn: Date) {
		this.deletedOn = deletedOn;
	}
	setState(state: string) {
		this.state = state;
	}
	setPassword(city: string) {
		this.city = city;
	}
	setCountry(country: string) {
		this.country = country;
	}
	setDate(createdOn: Date) {
		this.createdOn = createdOn;
	}
	setAddressLine2(addressLine2: string) {
		this.addressLine2 = addressLine2;
	}
	setZipcode(zipcode: string) {
		this.zipcode = zipcode;
	}
	setEstFeedbackEmailId(estFeedbackEmailId: string) {
		this.estFeedbackEmailId = estFeedbackEmailId;
	}
	setEstBrandName(estBrandName: string) {
		this.estBrandName = estBrandName;
	}
	setestCountryIsoCode(estCountryIsoCode: string) {
		this.estCountryIsoCode = estCountryIsoCode;
	}
	setestCountryIsdCode(estCountryIsdCode: string) {
		this.estCountryIsdCode = estCountryIsdCode;
	}
}
