
export class EstablishmentCourseInfo {
	parentId: number;
	estId: number;
	courseId: number;
	role: number;
	createdOn: Date;

	constructor() {
		this.parentId = 0;
		this.estId = 0;
		this.courseId = 0;
		this.role = 0;
		this.createdOn = null
	}
	setId(parentId: number) {
		this.parentId = parentId;
	}
	setEst(estId: number) {
		this.estId = estId;
	}
	setCourse(courseId: number) {
		this.courseId = courseId;
	}
	setRole(role: number) {
		this.role = role;
	}
	setDuration(createdOn: Date) {
		this.createdOn = createdOn;
	}
}
