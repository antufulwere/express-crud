import { Context, Next } from 'koa';
import Joi from 'joi';
import errorHandler from '../utils/ApiErrorHandler';
import logger from '../../logger';
import arrowup from '../db/entity/arrowup';
import HttpStatusCode from '../constant/HttpStatusCode';
import Message from "../constant/Messages";
class EstablishmentValidator {
    constructor() { }
    async createEstablishment(ctx: Context, next: Next): Promise<any | void> {
        try {
            const bodyValidation = Joi.object({
                estName: Joi.string().required(),
                estEmailId: Joi.string().optional().allow(null, ""),
                estContactNumber: Joi.string().optional(),
                addressLine1: Joi.string().optional(),
                addressLine2: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                country: Joi.string().optional(),
                zipcode: Joi.string().optional(),
                // estParentId: Joi.string().required(),
                estIdentifyingKey: Joi.string().length(10).required(),
                userFirstName: Joi.string().required(),
                userLastName: Joi.string().required(),
                userEmailId: Joi.string().email().optional(),
                userContactNumber: Joi.string().optional(),
                password: Joi.string().required(),
                // passwordConfirmation: Joi.string().required(),
                estFeedbackEmailId: Joi.string().email().optional(),
                estBrandName: Joi.string().optional().allow(null, ""),
                countryIsoCode: Joi.string().optional(),
                countryIsdCode: Joi.string().optional(),
                estCountryIsoCode: Joi.string().optional(),
                estCountryIsdCode: Joi.string().optional(),
                employeeCode: Joi.string().optional(),
                userPosition: Joi.number().optional(),
            });
            const body = ctx.request.body;
            const { error } = bodyValidation.validate(body);
            if (error) {
                const errorMessage: string = errorHandler.errorHandler(ctx, error);
                logger.error(`Validation: createEstablishment, Error: ${errorMessage}`);
                return;
            }
            const isUserExists = await arrowup.users.findOne({
                where: {
                    userEmailId: ctx.request.body.userEmailId,
                    isActive: true,
                },
            });
            if (isUserExists) {
                // Handle the case where the user does not exist
                ctx.body = { error: Message.USER_ALREADY_EXISTS };
                ctx.status = HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY;
                ctx.success = false;
                return;
            }
            return next();
        } catch (error) {
            // console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Validation: createEstablishment, Error: ${errorMessage}`);
            return;
        }
    }

    async updateEstablishment(ctx: Context, next: Next): Promise<any | void> {
        try {
            const bodyValidation = Joi.object({
                estName: Joi.string().optional(),
                estEmailId: Joi.string().optional().allow(null, ""),
                estContactNumber: Joi.string().optional(),
                addressLine1: Joi.string().optional(),
                addressLine2: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                country: Joi.string().optional(),
                zipcode: Joi.string().optional(),
                status: Joi.string().optional(),
                estFeedbackEmailId: Joi.string().email().optional(),
                estBrandName: Joi.string().optional().allow(null, ""),
                estCountryIsoCode: Joi.string().optional(),
                estCountryIsdCode: Joi.string().optional(),
            });
            const body = ctx.request.body;
            const { error } = bodyValidation.validate(body);
            if (error) {
                const errorMessage: string = errorHandler.errorHandler(ctx, error);
                logger.error(`Validation: updateEstablishment, Error: ${errorMessage}`);
                return;
            }
            return next();
        } catch (error) {
            // console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Validation: updateEstablishment, Error: ${errorMessage}`);
            return;
        }
    }
    async loginEstablishment(ctx: Context, next: Next): Promise<any | void> {
        try {
            const bodyValidation = Joi.object({
                estIdentifyingKey: Joi.string().length(10).required()
            });
            const body = ctx.request.body;
            const { error } = bodyValidation.validate(body);
            if (error) {
                const errorMessage: string = errorHandler.errorHandler(ctx, error);
                logger.error(`Validation: loginEstablishment, Error: ${errorMessage}`);
                return;
            }
            return next();
        } catch (error) {
            // console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Validation: updateEstablishment, Error: ${errorMessage}`);
            return;
        }
    }
    async getEstablishmentItems(ctx: Context, next: Next): Promise<any | void> {
        try {
            const paramsValidation = Joi.object({
                estParentId: Joi.number().required(),
                estId: Joi.number().required(),
                userId: Joi.number().required(),
            });
            const params = ctx.params;
            const { error } = paramsValidation.validate(params);
            if (error) {
                const errorMessage: string = errorHandler.errorHandler(ctx, error);
                logger.error(
                    `Validation: getEstablishmentItems, Error: ${errorMessage}`
                );
                return;
            }
            return next();
        } catch (error) {
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Validation: getEstablishmentItems, Error: ${errorMessage}`);
            return;
        }
    }
    async updateEstForms(ctx: Context, next: Next): Promise<any | void> {
        try {
            const paramsValidation = Joi.object({
                formData: Joi.object().optional(),
                status: Joi.string().valid('NOT_STARTED', 'COMPLETED', 'IN_PROGRESS').optional(),
                formUrl: Joi.string().optional(),
            });
            const body = ctx.request.body;
            const { error } = paramsValidation.validate(body);
            if (error) {
                const errorMessage: string = errorHandler.errorHandler(ctx, error);
                logger.error(
                    `Validation: updateEstForms, Error: ${errorMessage}`
                );
                return;
            }
            return next();
        } catch (error) {
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Validation: getEstablishmentItems, Error: ${errorMessage}`);
            return;
        }
    }
    async getUserActivities(ctx: Context, next: Next): Promise<any | void> {
        try {
            const paramsValidation = Joi.object({
                estParentId: Joi.number().required(),
                estId: Joi.number().required(),
                userId: Joi.number().required(),
            });
            const params = ctx.params;
            const { error } = paramsValidation.validate(params);
            if (error) {
                const errorMessage: string = errorHandler.errorHandler(ctx, error);
                logger.error(
                    `Validation: getUserActivities, Error: ${errorMessage}`
                );
                return;
            }
            return next();
        } catch (error) {
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Validation: getUserActivities, Error: ${errorMessage}`);
            return;
        }
    }
}

const parentEstablishmentValidator: EstablishmentValidator =
    new EstablishmentValidator();
export default parentEstablishmentValidator;