import { Context } from 'koa';
import arrowup from '../db/entity/arrowup';
import Message from '../constant/Messages';
import HttpStatusCode from '../constant/HttpStatusCode';
class formsService {
    constructor() { }

    async addForm(ctx: Context): Promise<any> {
        const body = ctx.request.body;
        const forms = await arrowup.forms.create(body);
        if (forms) {
            return { response: forms, statusCode: HttpStatusCode.HTTP_CREATED, success: true };
        } else {
            throw new Error(Message.SOMETHING_WENT_WRONG);
        }
    }
    async getForms(ctx: Context): Promise<any> {
        const allForms = await arrowup.forms.findAll({
            where: {
                isDeleted: false
            }
        });
        if (allForms) {
            return { response: allForms, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
        } else {
            throw new Error(Message.SOMETHING_WENT_WRONG);
        }
    }
    async getForm(ctx: Context): Promise<any> {
        const id: number = ctx.params.id;
        const allForms = await arrowup.forms.findOne({
            where: {
                formId: id
            }
        });
        if (allForms) {
            return { response: allForms, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
        } else {
            throw new Error(Message.SOMETHING_WENT_WRONG);
        }
    }
    async updateForm(ctx: Context): Promise<any> {
        const id: number = ctx.params.id;
        const body = ctx.request.body;
        const updatedForm = await arrowup.forms.update(body, {
            where: { formId: id }
        });
        if (updatedForm) {
            return { response: Message.UPDATE_SUCCESS, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
        } else {
            throw new Error(Message.SOMETHING_WENT_WRONG);
        }
    }
}

const formsServices: formsService = new formsService();
export default formsServices;
