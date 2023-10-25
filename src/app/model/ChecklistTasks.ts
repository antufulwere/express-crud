
export class ChecklistTemplates {
    id: number;
    sequence: number;

    constructor() {
        this.id = 0;
        this.sequence = 0;
    }
    setId(id: number) {
        this.id = id;
    }
    setSeq(sequence: number) {
        this.sequence = sequence;
    }
}
