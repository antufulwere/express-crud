export class CourseTrainings {
    id: number;
    parentId: number;
    estId: number;
    formId: number;
    completedBy: number;
    dueDate: Date;
    formData: string;
    status: string;
    completionDate: Date;
    completedOn: Date;
    formUrl: string;

    constructor() {
        this.id = 0;
        this.parentId = null;
        this.estId = null;
        this.formId = null;
        this.completedBy = null;
        this.dueDate = null;
        this.formData = null;
        this.status = null;
        this.completionDate = null;
        this.completedOn = null;
        this.formUrl = null;

    }
}
