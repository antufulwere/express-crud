import { Context, Next } from 'koa';
import Joi from 'joi';
import errorHandler from '../utils/ApiErrorHandler';
import logger from '../../logger';

class ParentEstablishmentValidator {
	constructor() { }
	async createParentEstablishment(ctx: Context, next: Next): Promise<any | void> {
		try {
			const bodyValidation = Joi.object({
				estParentName: Joi.string().required(),
				imageLink: Joi.string().optional(),
				roles: Joi.array().optional(),
				accentColorFirst: Joi.string().optional(),
				accentColorSecond: Joi.string().optional(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: createParentEstablishment, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: createParentEstablishment, Error: ${errorMessage}`);
			return;
		}
	}

	async updateParentEstablishment(ctx: Context, next: Next): Promise<any | void> {
		try {
			const bodyValidation = Joi.object({
				estParentName: Joi.string().optional(),
				imageLink: Joi.string().optional(),
				status: Joi.string().optional(),
				deleteLinks: Joi.array().optional(),
				roles: Joi.array().optional(),
				accentColorFirst: Joi.string().optional(),
				accentColorSecond: Joi.string().optional(),
				deleteRoles: Joi.array().optional(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: updateParentEstablishment, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: updateParentEstablishment, Error: ${errorMessage}`);
			return;
		}
	}
}

const parentEstablishmentValidator: ParentEstablishmentValidator = new ParentEstablishmentValidator();
export default parentEstablishmentValidator;
