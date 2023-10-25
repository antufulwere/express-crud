
export class Checklist {
    id: number;
    taskHeader: string;
    taskDescription: string;
    taskThumbnail: string;
    isDeleted: boolean;

    constructor() {
        this.id = 0;
        this.taskHeader = null;
        this.taskDescription = null;
        this.isDeleted = false;
    }
    setId(id: number) {
        this.id = id;
    }
    setHeader(taskHeader: string) {
        this.taskHeader = taskHeader;
    }
    setDesc(taskDescription: string) {
        this.taskDescription = taskDescription;
    }
    setDeleted(isDeleted: boolean) {
        this.isDeleted = isDeleted;
    }
    setThumb(taskThumbnail: string) {
        this.taskThumbnail = taskThumbnail
    }
}
