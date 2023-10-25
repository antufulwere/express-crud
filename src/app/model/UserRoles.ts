export class UserRoles {
	id: number;
	roleName: string;
	passwordType: string;
	isActive: boolean;
	isAppRole: boolean;
	isLocationSpecific: boolean
	slug: string;
	constructor() {
		this.id = 0;
		this.roleName = null;
		this.passwordType = null;
		this.isAppRole = null;
		this.isLocationSpecific = null
		this.slug = null
	}

	setId(id: number) {
		this.id = id;
	}

	setRoleName(roleName: string) {
		this.roleName = roleName;
	}
	setAppRole(isAppRole: boolean) {
		this.isAppRole = isAppRole;
	}
	setPassword(passwordType: string) {
		this.passwordType = passwordType;
	}
	setActive(isActive: boolean) {
		this.isActive = isActive;
	}
}
