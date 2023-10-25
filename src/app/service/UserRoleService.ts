import { Context } from 'koa';
import arrowup from '../db/entity/arrowup';
import Message from '../constant/Messages';
import HttpStatusCode from '../constant/HttpStatusCode';
class UserRolesService {
	constructor() { }

	async addRole(ctx: Context): Promise<any> {
		const body = ctx.request.body;
		// const passwordType = ctx.request.body.passwordType;
		let result: any = {};
		const checkRoleAlreadyExist: any = await arrowup.userRoles.findOne({
			where: {
				roleName: body['roleName']
			}
		});
		if (checkRoleAlreadyExist) {
			result = {
				response: Message.ROLE_ALREADY_EXISTS, statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY, success: false,
				error: {
					details: [
						{ message: Message.ROLE_ALREADY_EXISTS }
					]
				}
			};
		} else {
			body.slug = body['roleName'].toUpperCase();
			const userRoles = await arrowup.userRoles.create(body);

			if (userRoles) {
				result = { response: Message.ROLE_SUCCESS, statusCode: HttpStatusCode.HTTP_CREATED, success: true };
			} else {
				throw new Error(Message.SOMETHING_WENT_WRONG);
			}
		}
		return result;
	}
	async getRoles(ctx: Context): Promise<any> {
		const where: any = { isActive: true }
		const queryParams: any = ctx.query;
		const appRoles = queryParams["appRoles"];
		const isLocationSpecific = queryParams["isLocationSpecific"];
		if (appRoles && appRoles == 'true') {
			where.isAppRole = true
		}
		if (isLocationSpecific) {
			where.isLocationSpecific = isLocationSpecific
		}
		console.log("where--", where)
		const allRoles = await arrowup.userRoles.findAll({ where });
		if (allRoles) {
			return { response: allRoles, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
		} else {
			throw new Error(Message.SOMETHING_WENT_WRONG);
		}
	}
	async updateRole(ctx: Context): Promise<any> {
		const id: number = ctx.params.id;
		const body = ctx.request.body;
		console.log('body-------------', body, id, 'idididid');
		const updatedRole = await arrowup.userRoles.update(body, {
			where: { id }
		});
		if (updatedRole) {
			return { response: Message.UPDATE_SUCCESS, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
		} else {
			throw new Error(Message.SOMETHING_WENT_WRONG);
		}
	}
	async deleteRole(ctx: Context): Promise<any> {
		const id: number = ctx.params.id;
		let result: any = {};
		// check if role is already in use
		const user = await arrowup.users.findOne({
			where: {
				userRoleId: id
			}
		});
		if (user) {
			result = { response: Message.ROLE_ASSOCIATION, statusCode: HttpStatusCode.HTTP_BAD_REQUEST, success: false };
		} else {
			const estChecklist = await arrowup.establishmentChecklistScheduleInfos.findOne({
				where: {
					role: id
				}
			});
			if (estChecklist) {
				result = { response: Message.ROLE_ASSOCIATION, statusCode: HttpStatusCode.HTTP_BAD_REQUEST, success: false };
			} else {
				await arrowup.userRoles.destroy({
					where: {
						id
					}
				});
				result = { response: Message.DELETE_SUCCESS, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
			}
		}
		return result;
	}
}

const userRolesService: UserRolesService = new UserRolesService();
export default userRolesService;
