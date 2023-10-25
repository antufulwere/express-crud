
export class Forms {
    formId: number;
    formName: string;
    isDeleted: boolean;

    constructor() {
        this.formId = 0;
        this.formName = null;
        this.isDeleted = false;
    }
    setformId(formId: number) {
        this.formId = formId;
    }
    setHeader(formName: string) {
        this.formName = formName;
    }
    setDeleted(isDeleted: boolean) {
        this.isDeleted = isDeleted;
    }
}
