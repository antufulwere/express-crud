
export class Checklist {
    id: number;
    checklistName: string;
    createdOn: Date;
    isDeleted: boolean;

    constructor() {
        this.id = 0;
        this.checklistName = null;
        this.createdOn = null;
        this.isDeleted = false;
    }
    setId(id: number) {
        this.id = id;
    }
    setHeader(checklistName: string) {
        this.checklistName = checklistName;
    }
    setDesc(createdOn: Date) {
        this.createdOn = createdOn;
    }
    setDeleted(isDeleted: boolean) {
        this.isDeleted = isDeleted;
    }
}
