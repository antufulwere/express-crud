
export class ParentEstablishment {
	estParentId: number;
	estParentName: string;
	status: string;
	createdOn: Date;
	imageLink: string;
	accentColorFirst: string;
	accentColorSecond: string;
	constructor() {
		this.estParentId = 0;
		this.estParentName = null;
		this.status = null;
		this.imageLink = null;
		this.accentColorFirst = null;
		this.accentColorSecond = null;
	}

	setId(estParentId: number) {
		this.estParentId = estParentId;
	}

	setestParentName(estParentName: string) {
		this.estParentName = estParentName;
	}

	setStatus(status: string) {
		this.status = status;
	}

	setDate(createdOn: Date) {
		this.createdOn = createdOn;
	}
	setLink(imageLink: string) {
		this.imageLink = imageLink
	}
	setAccentColorFirst(accentColorFirst: string) {
		this.accentColorFirst = accentColorFirst
	}
	setAccentColorSecond(accentColorSecond: string) {
		this.accentColorSecond = accentColorSecond
	}

}
