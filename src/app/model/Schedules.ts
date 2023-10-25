
export class Schedule {
    id: number;
    name: string;
    isDeleted: boolean;

    constructor() {
        this.id = 0;
        this.name = null;
        this.isDeleted = false;
    }
    setId(id: number) {
        this.id = id;
    }
    setHeader(name: string) {
        this.name = name;
    }
    setDeleted(isDeleted: boolean) {
        this.isDeleted = isDeleted;
    }
}
