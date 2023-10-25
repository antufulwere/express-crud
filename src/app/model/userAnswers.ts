export class userAnswers {

    id: number;
    questionId: number;
    userId: number;
    answer: string;
    createdOn: Date;
    
    constructor() {
        this.id = 0;
        this.questionId = null;
        this.userId = null;
        this.answer = null;
        this.createdOn = null
    }
}    