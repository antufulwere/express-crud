
export class User {
	id: number;
	userFirstName: string;
	userLastName: string;
	userEmailId: string;
	userContactNumber: string;
	resetPasswordToken: string;
	resetPasswordSentAt: string;
	userDateOfJoining: Date;
	isActive: boolean;
	isDeleted: boolean;
	password: string;
	createdOn: Date;
	userName: string;
	countryIsoCode: string;
	countryIsdCode: string;
	userPosition: number;

	constructor() {
		this.id = 0;
		this.userFirstName = null;
		this.userLastName = null;
		this.userEmailId = null;
		this.userContactNumber = null;
		this.resetPasswordToken = null;
		this.userDateOfJoining = new Date();
		this.isActive = true;
		this.isDeleted = false;
		this.password = null;
		this.userName = null;
		this.countryIsoCode = null;
		this.countryIsdCode = null;
		this.resetPasswordSentAt = null
		this.userPosition = null
	}

	setId(id: number) {
		this.id = id;
	}

	setuserFirstName(userFirstName: string) {
		this.userFirstName = userFirstName;
	}

	setLastName(userLastName: string) {
		this.userLastName = userLastName;
	}

	setEmail(userEmailId: string) {
		this.userEmailId = userEmailId;
	}
	setContact(userContactNumber: string) {
		this.userContactNumber = userContactNumber;
	}
	setPosition(resetPasswordToken: string) {
		this.resetPasswordToken = resetPasswordToken;
	}
	setJoiningDate(userDateOfJoining: Date) {
		this.userDateOfJoining = userDateOfJoining;
	}
	setActive(isActive: boolean) {
		this.isActive = isActive;
	}
	setPassword(password: string) {
		this.password = password;
	}
	setDelete(isDeleted: boolean) {
		this.isDeleted = isDeleted;
	}
	setDate(createdOn: Date) {
		this.createdOn = createdOn;
	}
	setUserName(userName: string) {
		this.userName = userName;
	}
	setcountryIsoCode(countryIsoCode: string) {
		this.countryIsoCode = countryIsoCode;
	}
	setcountryIsdCode(countryIsdCode: string) {
		this.countryIsdCode = countryIsdCode;
	}
	setUserPosition(userPosition: number) {
		this.userPosition = userPosition;
	}
}
