import { Context } from 'koa';
import message from '../constant/ErrorMessages';
import statusCode from '../constant/HttpStatusCode';

class ErrorHandler {
	errorHandler(ctx: Context, error: any): string {
		console.log('eeeeeeeeeeee \n', error);
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
			const errorMessages: any = (error.error) ? ((error.error.error && error.error.error.message)
				? error.error.error.message : error.error.error) : error.message;
			ctx.body = {
				error: message.SOMETHING_WENT_WRONG
			};
			ctx.status = error.statusCode ? error.statusCode : statusCode.HTTP_INTERNAL_SERVER_ERROR;
			return errorMessages;
		}
	}
}

const errorHandler: ErrorHandler = new ErrorHandler();
export default errorHandler;
