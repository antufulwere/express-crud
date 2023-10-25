
export class Summaries {
    id: number;
    userId: number;
    field: string;
    updatedValue: string;
    createdOn: Date

    constructor() {
        this.id = 0;
        this.userId = null;
        this.field = null;
        this.updatedValue = null;
        this.createdOn = null;
    }
}
