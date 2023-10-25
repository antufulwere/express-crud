import { Context } from 'koa';
import logger from '../../logger';

import errorHandler from '../utils/ApiErrorHandler';
import FormService from '../service/FormService';
import apiResponseHandler from '../constant/ResponseHandler';
class FormController {
    constructor() { }

    async addForm(ctx: Context) {
        try {
            logger.info(`Controller : addForm, Request-Body : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
            const { response, statusCode, success, error } = await FormService.addForm(ctx);
            if (!success) {
                apiResponseHandler.errorHandler(ctx, error);
            } else {
                apiResponseHandler.response(ctx, response, success, statusCode);
            }
        } catch (error) {
            console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Controller: addForm, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
        }
    }
    async getForms(ctx: Context) {
        try {
            logger.info(`Controller : getForms, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
            const { response, statusCode, success } = await FormService.getForms(ctx);
            apiResponseHandler.response(ctx, response, success, statusCode);
        } catch (error) {
            console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Controller: getForms, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
        }
    }
    async getForm(ctx: Context) {
        try {
            logger.info(`Controller : getForms, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
            const { response, statusCode, success } = await FormService.getForm(ctx);
            apiResponseHandler.response(ctx, response, success, statusCode);
        } catch (error) {
            console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Controller: getForms, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
        }
    }
    async updateForm(ctx: Context) {
        try {
            logger.info(`Controller : updateForm, Request-Body : ${JSON.stringify(ctx.request.body)} date: ${new Date()}`);
            const { response, statusCode, success } = await FormService.updateForm(ctx);
            apiResponseHandler.response(ctx, response, success, statusCode);
        } catch (error) {
            console.log(error);
            const errorMessage: string = errorHandler.errorHandler(ctx, error);
            logger.error(`Controller: updateForm, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
        }
    }
}

const FormControllers: FormController = new FormController();
export default FormControllers;
