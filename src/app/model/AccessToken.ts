export class AccessToken {
	id: number;
	token: string;

	constructor() {
		this.id = 0;
		this.token = null;
	}

	setId(id: number) {
		this.id = id;
	}

	settoken(token: string) {
		this.token = token;
	}
}
