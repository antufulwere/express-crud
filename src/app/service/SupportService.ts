import { Context } from 'koa';
import Message from '../constant/Messages';
import HttpStatusCode from '../constant/HttpStatusCode';
import arrowup from '../db/entity/arrowup';

class SupportService {
	constructor() { }

	async getSupport(ctx: Context) {
		const query: {
			key?: string;
		} = ctx.request.query;
		try {
			const support = await arrowup.supportDatas.findAll({
				where: {
					key: query.key
				},
				raw: true
			});

			if (!support.length) {
				return {
					message: Message.SUPPORT_NOT_FOUND(query.key),
					success: false,
					statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
				};
			}

			return {
				response: support, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true
			};
		} catch (error) {
			throw error;
		}
	}

	async addSupport(ctx: Context) {
		try {
			const body: any = ctx?.request?.body;
			const supportData = await arrowup.supportDatas.create({
				key: body.key,
				slug: body.slug,
				value: body.value,
			});
			if (!supportData) {
				return {
					message: Message.SOMETHING_WENT_WRONG,
					success: false,
					statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
				};
			}
			return {
				response: supportData, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true
			};
		} catch (error) {
			throw error;
		}
	}

	async updateSupport(ctx: Context) {
		// service for Updating SupportData
		try {
			const { id } = ctx?.params;
			const bodyData: {
				slug?: string,
				key?: string,
				value?: string,
			} = ctx?.request?.body;

			const supportData = await arrowup.supportDatas.findOne({ where: { id: id } });
			if (!supportData) {
				return {
					message: Message.SUPPORT_DATA.SUPPORT_ID_NOT_FOUND,
					success: false,
					statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
				};
			}

			const updatedData = await arrowup.supportDatas.update(bodyData, { where: { id: id } });
			if (!updatedData) {
				return {
					message: Message.SUPPORT_DATA.SUPPORT_ID_NOT_FOUND,
					success: false,
					statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
				};
			}

			return {
				response: Message.SUPPORT_DATA.SUPPORT_DATA_UPDATED_SUCCESSFULLY, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true
			};
		} catch (error) {
			throw error;
		}
	}

	async deleteSupport(ctx: Context) {
		// service for Deleting SupportData
		try {
			const { id } = ctx?.params;
			const deletedData = await arrowup.supportDatas.destroy({ where: { id: id } });

			if (!deletedData) {
				return {
					message: Message.SUPPORT_DATA.SUPPORT_DATA_NOT_FOUND,
					success: false,
					statusCode: HttpStatusCode.HTTP_BAD_REQUEST,
				};
			}
			return {
				response: deletedData, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true
			};
		} catch (error) {
			throw error;
		}
	}
}

const supportService: SupportService = new SupportService();
export default supportService;
