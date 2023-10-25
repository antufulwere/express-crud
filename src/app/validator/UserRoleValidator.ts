import { Context, Next } from 'koa';
import Joi from 'joi';
import errorHandler from '../utils/ApiErrorHandler';
import logger from '../../logger';

class UserRolesValidator {
	constructor() { }
	async createRole(ctx: Context, next: Next): Promise<any | void> {
		try {
			const bodyValidation = Joi.object({
				roleName: Joi.string().required(),
				passwordType: Joi.string().required(),
				isAppRole: Joi.boolean().optional(),
				isLocationSpecific: Joi.boolean().optional(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: createRole, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: createRole, Error: ${errorMessage}`);
			return;
		}
	}
	async updateRole(ctx: Context, next: Next): Promise<any | void> {
		try {
			const bodyValidation = Joi.object({
				roleName: Joi.string().optional(),
				passwordType: Joi.string().required(),
				isActive: Joi.boolean().optional(),
				isAppRole: Joi.boolean().optional(),
				isLocationSpecific: Joi.boolean().optional(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: updateRole, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: updateRole, Error: ${errorMessage}`);
			return;
		}
	}
}

const userValidator: UserRolesValidator = new UserRolesValidator();
export default userValidator;
