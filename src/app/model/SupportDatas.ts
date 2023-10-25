
export class SupportDatas {
	id: number;
	key: string;
	value: string;
	slug: string;
	constructor() {
		this.id = 0;
		this.key = null;
		this.value = null;
		this.slug = null
	}

	setId(id: number) {
		this.id = id;
	}

	setKey(key: string) {
		this.key = key;
	}

	setValue(value: string) {
		this.value = value;
	}
	setSlug(slug: string) {
		this.slug = slug;
	}

}
