import { Context, Next } from 'koa';
import Joi from 'joi';
import errorHandler from '../utils/ApiErrorHandler';
import logger from '../../logger';

class FormsValidator {
	constructor() { }
	async createForm(ctx: Context, next: Next): Promise<any | void> {
		try {
			const bodyValidation = Joi.object({
				formName: Joi.string().required(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: createForm, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: createForm, Error: ${errorMessage}`);
			return;
		}
	}
	async updateForm(ctx: Context, next: Next): Promise<any | void> {
		try {
			const bodyValidation = Joi.object({
				formName: Joi.string().optional(),
				isDeleted: Joi.boolean().optional(),
			});
			const body = ctx.request.body;
			const { error } = bodyValidation.validate(body);
			if (error) {
				const errorMessage: string = errorHandler.errorHandler(ctx, error);
				logger.error(`Validation: updateForm, Error: ${errorMessage}`);
				return;
			}
			return next();
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Validation: updateForm, Error: ${errorMessage}`);
			return;
		}
	}
}

const userValidator: FormsValidator = new FormsValidator();
export default userValidator;
