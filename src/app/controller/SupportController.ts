import { Context } from 'koa';
import logger from '../../logger';
import supportService from '../service/SupportService';
import errorHandler from '../utils/ApiErrorHandler';
import apiResponseHandler from '../constant/ResponseHandler';

class SupportController {
	constructor() { }
	async getSupport(ctx: Context) {
		try {
			const { statusCode, response, success } = await supportService.getSupport(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getSupport, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async addSupport(ctx: Context) {
		try {
			const { statusCode, response, success } = await supportService.addSupport(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addSupport, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`)

		}
	}

	async updateSupport(ctx: Context) {
		try {
			const { statusCode, response, success } = await supportService.updateSupport(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.error(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller updateSupprt, Error: ${JSON.stringify(errorMessage)}`, `date: ${Date.now()}`)
		}
	}

	async deleteSupport(ctx: Context) {
		try {
			const { statusCode, response, success } = await supportService.deleteSupport(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.error(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller deleteSupport, Error: ${JSON.stringify(errorMessage)}`, `date: ${Date.now()}`)
		}
	}
	
}

const supportController: SupportController = new SupportController();
export default supportController;
