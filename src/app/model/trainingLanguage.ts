
export class Training {
    id: number;
    // language: string;
    trainingThumbnail: string;
    trainingURL: string;
    duration: string;
    trainingId: number;
    hostingUrl: string;
    constructor() {
        this.id = 0;
        // this.language = null;
        this.trainingThumbnail = null;
        this.trainingURL = null;
        this.duration = null;
        this.trainingId = 0
        this.hostingUrl = null
    }
    setId(id: number) {
        this.id = id;
    }
    // setName(language: string) {
    //     this.language = language;
    // }
    setDescription(trainingThumbnail: string) {
        this.trainingThumbnail = trainingThumbnail;
    }
    setType(trainingURL: string) {
        this.trainingURL = trainingURL;
    }
    setDuration(duration: string) {
        this.duration = duration;
    }
    setTrainingId(trainingId: number) {
        this.trainingId = trainingId;
    }
    setUrl(hostingUrl: string) {
        this.hostingUrl = hostingUrl;
    }

}
