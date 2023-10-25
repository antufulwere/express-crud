
export class ChecklistSchedules {
    id: number;
    type: string;
    endDate: Date;
    startDate: Date;
   
    constructor() {
        this.id = 0;
        this.type = null;
        this.endDate = null;
        this.startDate = null;
    }
    setId(id: number) {
        this.id = id;
    }
    settype(type: string) {
        this.type = type;
    }
    setEnd(endDate: Date) {
        this.endDate = endDate;
    }
    setStart(startDate: Date) {
        this.startDate = startDate;
    }
}
