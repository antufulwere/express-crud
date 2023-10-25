
export interface Result {
    success: boolean;
    response: any; // Replace 'any' with the appropriate type for the response property
    statusCode: number; // Replace 'number' with the appropriate type for the statusCode property
    error?: {
        details: { message: string }[];
    };
}

export interface CommonResponse {
    response: any; // Replace 'any' with the appropriate type for the response property
    statusCode: number; // Replace 'number' with the appropriate type for the statusCode property
    success: boolean;
    error?: {
        details: { message: string }[];
    };
}