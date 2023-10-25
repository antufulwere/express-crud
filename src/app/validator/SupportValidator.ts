import Joi from 'joi';
import { Context, Next } from 'koa';
import logger from '../../logger';
import errorHandler from '../utils/ApiErrorHandler';

class SupportValidator {
	constructor() { }
	async getSupport(ctx: Context, next: Next) {
		try {
			const queryValidation = Joi.object({
				key: Joi.string().required(),
			});
			const query = ctx.request.query;
			const { error } = queryValidation.validate(query);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: getSupport, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: getSupport, Error: ${errorMessage}`);
			return;
		}
	}

	async addSupport(ctx: Context, next: Next) {
		try {
			const bodyValidation = Joi.object({
				key: Joi.string().required(),
				value: Joi.string().required(),
				slug: Joi.string().required(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: addSupport, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: addSupport, Error: ${errorMessage}`);
			return;
		}
	}

	async updateSupport(ctx: Context, next: Next) {
		try {
			const bodyValidation = Joi.object({
				key: Joi.string().required(),
				value: Joi.string().required(),
				slug: Joi.string().required(),
			});

			const queryValidation = Joi.object({
				id: Joi.number().required(),
			})
			const body = ctx.request.body;
			const { error: paramsError } = queryValidation.validate(ctx.params);
			const { error: bodyError } = bodyValidation.validate(ctx.request.body);
			if (paramsError) {
				const errorMessage = errorHandler.errorHandler(ctx, paramsError);
				logger.error(`Validation: updateSupport, Error: ${errorMessage}`);
				return;
			}

			if (bodyError) {
				const errorMessage = errorHandler.errorHandler(ctx, bodyError);
				logger.error(`Validation: updateSupport, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: updateSupport, Error: ${errorMessage}`);
			return;
		}
	}

	async deleteSupport(ctx: Context, next: Next) {
		try {
			const paramsValidation = Joi.object({
				id: Joi.number().required(),
			});

			const { error } = paramsValidation.validate(ctx.params);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: deleteSupport, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: deleteSupport, Error: ${errorMessage}`);
			return;
		}
	}
}

const supportValidator: SupportValidator = new SupportValidator();
export default supportValidator;
