
export class EstablishmentImages {
	id: number;
	estId: number;
	imageKey: string;
	imageUrl: string;

	constructor() {
		this.id = 0;
		this.estId = 0;
		this.imageKey = null;
		this.imageUrl = null;
	}

	setId(id: number) {
		this.id = id;
	}

	setEstId(estId: number) {
		this.estId = estId;
	}

	setImageKey(imageKey: string) {
		this.imageKey = imageKey;
	}

	setImageUrl(imageUrl: string) {
		this.imageUrl = imageUrl;
	}

	getId() {
        return this.id;
    }

	getEstId() {
		return this.estId;
	}

	getImageUrl() {
		return this.imageUrl;
	}

	getImageKey() {
		return this.imageKey;
	}
}