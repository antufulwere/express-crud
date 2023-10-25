import { Context } from 'koa';
import logger from '../../logger';

import errorHandler from '../utils/ApiErrorHandler';
import establishmentService from '../service/EstablishmentService';
import apiResponseHandler from '../constant/ResponseHandler';
class Establishment {
	constructor() { }

	async addEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : addEstablishment, - : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
			const { response, statusCode, success, error, userErr } = await establishmentService.addEstablishment(ctx);
			if (!success) {
				apiResponseHandler.errorHandler(ctx, error);
			} else {
				ctx.body = {
					success,
					statusCode,
					message: userErr,
					data: response
				};
				ctx.status = statusCode;
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getEstablishments(ctx: Context) {
		try {
			logger.info(`Controller : getEstablishments, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success, total } = await establishmentService.getEstablishments(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode, total);
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getEstablishments, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : updateEstablishment, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
			const { response, statusCode, success } = await establishmentService.updateEstablishment(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : getEstablishment, Request-Body : ${JSON.stringify(ctx.params)} date: ${new Date()}`);
			const { response, statusCode, success, error } = await establishmentService.getEstablishment(ctx);
			if (!success) {
				apiResponseHandler.errorHandler(ctx, error);
			} else {
				apiResponseHandler.response(ctx, response, success, statusCode);
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async login(ctx: Context) {
		try {
			logger.info(`Controller : login, Request-Body : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
			const { response, statusCode, success, error } = await establishmentService.login(ctx);
			if (!success) {
				apiResponseHandler.errorHandler(ctx, error);
			} else {
				apiResponseHandler.response(ctx, response, success, statusCode);

			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: login, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUsers(ctx: Context) {
		try {
			logger.info(`Controller : login, Request-Body : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
			const { response, statusCode, success, total } = await establishmentService.getUsers(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode, total);
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: login, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async getEstablishmentItems(ctx: Context) {
		try {
			logger.info(
				`Controller : login, Request-Body : ${JSON.stringify(
					ctx.request
				)} date: ${new Date()}`
			);
			const { response, statusCode, success } =
				await establishmentService.getEstablishmentItems(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(
				`Controller: login, Error: ${JSON.stringify(errorMessage)}`,
				`date: ${new Date()}`
			);
		}
	}
	async getEstablishmentForms(ctx: Context) {
		try {
			logger.info(`Controller : getEstablishmentForms,  date: ${new Date()}`);
			const result: any = await establishmentService.getEstablishmentForms(ctx);
			apiResponseHandler.response(ctx, result.response, result.success, result.statusCode, result.total);
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getEstablishmentForms, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateEstablishmentForms(ctx: Context) {
		try {
			logger.info(`Controller : updateEstablishmentForms,  date: ${new Date()}`);
			const result: any = await establishmentService.updateEstablishmentForms(ctx);
			apiResponseHandler.response(ctx, result.response, result.success, result.statusCode, result.total);
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateEstablishmentForms, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUserActivities(ctx: Context) {
		try {
			const result = await establishmentService.getUserActivities(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserActivities, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
}

const parentEstablishment: Establishment = new Establishment();
export default parentEstablishment;
