
import { Context } from 'koa';
import message from './Messages';
import statusCode from './HttpStatusCode';

class ApiResponseHandler {
	errorHandler(ctx: Context, error: any): string {
		console.log('error--',error);
		let errorMessage = '';
		if (error.details && error.details.length) {
			error.details.forEach((element: { message: string; }) => {
				if (element.message) {
					errorMessage += element.message.replace(/"/g, '');
				}
			});
			ctx.body = {
				error: errorMessage
			};
			ctx.status = statusCode.HTTP_BAD_REQUEST;
			return errorMessage;
		} else if (error.response && error.response.data && error.response.data.messages.length) {
			error.response.data.messages.forEach((element: { message: string; }) => {
				if (element.message) {
					errorMessage += element.message.replace(/"/g, '');
				}
			});
			ctx.body = {
				error: errorMessage
			};
			ctx.status = error.response.status ? error.response.status : statusCode.HTTP_BAD_REQUEST;
			return errorMessage;
		} else if (error.errors && error.errors.length) {
			error.errors.forEach((element: any) => {
				if (element.message) {
					errorMessage += element.message.replace(/"/g, '');
				}
			});
			ctx.body = {
				error: errorMessage
			};
			ctx.status = error.errors.status ? error.errors.status : statusCode.HTTP_BAD_REQUEST;
			return errorMessage;
		} else {
			let errorMessages: any;
			if (error.error) {
				if (error.error.error && error.error.error.message) {
					errorMessages = error.error.error.message
				} else {
					errorMessages = error.error.error
				}
			} else {
				errorMessages = error.message
			}
			ctx.body = {
				error: message.SOMETHING_WENT_WRONG
			};
			if (error.response) {
				ctx.body = {
					error: error.response
				};
			}
			ctx.status = error.statusCode ? error.statusCode : statusCode.HTTP_INTERNAL_SERVER_ERROR;
			return errorMessages;
		}
	}
	response(ctx: Context, response: any, success: boolean, statusCode: number, total: number = null) {
		if (typeof response === 'string') {
			ctx.body = {
				success,
				statusCode,
				message: response
			};
			ctx.status = statusCode;
			return;
		}
		const body: any = {
			success,
			statusCode,
			data: response
		};
		if (total) {
			body.total = total;
		}
		ctx.body = body;
		ctx.status = statusCode;
		return;
	}
}

const apiResponseHandler: ApiResponseHandler = new ApiResponseHandler();
export default apiResponseHandler;
