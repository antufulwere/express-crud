export class CourseTrainings {
  id: number;
  userId: number;
  estId: number;
  courseId: number;
  trainingId: number;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  isCompleted: Date;
  startedOn: Date;
  completedOn: Date;
  lastAccessedOn: Date;
  durationCompleted: Date;
  trainingmonth: number;
  updatedOn: Date;
  isActive: number;
  trainingStatus: number;
  modifiedBy: number;
  trainingSequence: number;
  dueBeforeDays: number;
  isPriorityTraining: boolean;

  constructor() {
    this.id = 0;
    this.userId = null;
    this.estId = null;
    this.courseId = null;
    this.trainingId = null;
    this.scheduledStartDate = null;
    this.scheduledEndDate = null;
    this.isCompleted = null;
    this.startedOn = null;
    this.completedOn = null;
    this.lastAccessedOn = null;
    this.durationCompleted = null;
    this.trainingmonth = null;
    this.updatedOn = null;
    this.isActive = null;
    this.trainingStatus = null;
    this.modifiedBy = null;
    this.trainingSequence = 0;
    this.dueBeforeDays = 0;
    this.isPriorityTraining = null;
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
