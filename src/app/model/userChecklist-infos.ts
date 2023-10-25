export class CourseTrainings {
  id: number;
  userId: number;
  estId: number;
  scheduleId: number;
  checklistId: number;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  taskId: number;
  updatedOn: Date;
  isActive: number;
  checklistResponse: string;
  markAbsent: boolean;
  completedOn: Date;
  constructor() {
    this.id = 0;
    this.userId = null;
    this.estId = null;
    this.scheduleId = null;
    this.checklistId = null;
    this.scheduledStartDate = null;
    this.scheduledEndDate = null;
    this.taskId = null;
    this.updatedOn = null;
    this.isActive = null;
    this.checklistResponse = null;
    this.markAbsent = null;
    this.completedOn = null;
  }
  // setId(id: number) {
  // 	this.id = id;
  // }
  // setName(type: string) {
  // 	this.type = type;
  // }
  // // setDescription(dueBeforeDays: number) {
  // // 	this.dueBeforeDays = dueBeforeDays;
  // // }
  // setType(endDate: Date) {
  // 	this.endDate = endDate;
  // }
  // setUrl(startDate: Date) {
  // 	this.startDate = startDate;
  // }
  // setAddress(trainingSequence: string) {
  // 	this.trainingSequence = trainingSequence;
  // }
  // setCountry(isDeleted: string) {
  // 	this.isDeleted = isDeleted;
  // }
}
