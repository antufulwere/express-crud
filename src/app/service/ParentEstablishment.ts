import { Context } from 'koa';
import arrowup from '../db/entity/arrowup';
import Message from '../constant/Messages';
import HttpStatusCode from '../constant/HttpStatusCode';
import UserVariables from '../constant/UserVariables';
import { Op } from 'sequelize';
import CommonFuction from '../utils/CommonFunction'
import imageHandler from '../utils/ImageHandler'
import logger from '../../logger';
class ParentEstablishment {
	constructor() { }

	async addParentEstablishment(ctx: Context): Promise<any> {
		const body: any = ctx.request.body;
		let success = true, response = '', statusCode = 0, result: any = {};
		const alreadyFound: any = await arrowup.parentEstablishments.findOne({ where: { estParentName: body['estParentName'] } });
		const roles: any = body['roles']
		if (alreadyFound) {
			result = {
				response: Message.EST_ALREADY_EXISTS,
				success: false,
				statusCode: HttpStatusCode.HTTP_BAD_REQUEST
			}
		} else {
			delete body.roles
			body.createdOn = new Date()
			const parentData = await arrowup.parentEstablishments.create(body);
			if (success) {
				if (parentData) {
					//entry
					const parent = JSON.parse(JSON.stringify(parentData))
					if (roles && roles.length) {
						//creating entry of parent roles table
						roles.forEach((role: any) => {
							Object.assign(role, { parentId: parent.estParentId })
						});
						await arrowup.parentRoles.bulkCreate(roles, { returning: true });
					}
					result = { response: parent, statusCode: HttpStatusCode.HTTP_CREATED, success: true };
				} else {
					throw new Error(Message.SOMETHING_WENT_WRONG);
				}
			} else {
				result = {
					response,
					statusCode,
					success,
					error: {
						details: [
							{ message: response }
						]
					}
				};
			}
		}
		return result;
	}
	async updateParentEstablishment(ctx: Context): Promise<any> {
		try {
			const body: any = ctx.request.body;
			const id = ctx.params.id;
			const deleteLinks: any = body['deleteLinks']
			const roles: any = body['roles']
			const deleteRoles: any = body['deleteRoles']
			let success = true, response = '', statusCode = 0, result: any = {};
			const isParentExists = await arrowup.parentEstablishments.findOne({ where: { estParentId: id } });

			if (!isParentExists) {
				response = Message.PARENT_NOT_FOUND;
				success = false;
				statusCode = HttpStatusCode.HTTP_BAD_REQUEST;
			}
			if (success) {
				const parent = await arrowup.parentEstablishments.update(body, { where: { estParentId: id }, returning: true, plain: true });
				if (parent) {
					//update and add training
					await this.RoleAddAndUpdate(roles, id)
					if (deleteRoles && deleteRoles.length) {
						let userRoleExist = false;
						for (const id of deleteRoles) {
							let parent = await arrowup.parentRoles.findOne({ where: { id } });
							parent = JSON.parse(JSON.stringify(parent));
							const isRoleExist = await this.checkUserAssociateWithParent(parent.parentId, parent.userRoleId)
							if (isRoleExist) {
								console.log(isRoleExist, 'is role exist-----------------');
								response = Message.USER_ROLE_EXIST;
								success = false;
								statusCode = HttpStatusCode.HTTP_BAD_REQUEST;
								userRoleExist = true;
								break;
							} else {
								console.log("deleting roles---", id);
								await arrowup.parentRoles.destroy({ where: { id } });
							}
						}
						if (userRoleExist) {
							return result = {
								response,
								statusCode,
								success,
								error: {
									details: [
										{ message: response }
									]
								}
							};
						}
					}
					if (deleteLinks && deleteLinks.length) {
						const anys = deleteLinks.map((link: string) => {
							console.log("deleting---", link)
							return { Key: link }
						})
						console.log(deleteLinks, "deleted any")
						await imageHandler.deleteFileOnS3(anys)
					}
					if (body.imageLink) {
						await CommonFuction.assignImageToEst(id)
					}
					if (body.status) {
						let estStatus: any = {
							status: body.status
						}, userStatus: any = {}

						if (UserVariables.FORBBIDEN_STATUS.indexOf(body.status) > -1) {
							estStatus.deletedOn = UserVariables.DELETED_STATUS == body.status ? new Date() : null
							console.log(body.status, "body.statusbody.status")
							if (UserVariables.DELETED_STATUS == body.status) {
								userStatus.isDeleted = true
							}
							if (UserVariables.INACTIVE_STATUS == body.status) {
								userStatus.isActive = false
							}
						} else {
							//reactive est and users
							userStatus = {
								isActive: true
							}
						}
						console.log(userStatus, "userStatususerStatus", estStatus)
						// find all establishments for the parentid
						let establishments = await arrowup.establishments.findAll({
							where: {
								estParentId: isParentExists.estParentId,
							},
							attributes: ["estIdentifyingKey"],
						});
						console.log("establishments ====== \n\n", establishments.length);
						if (establishments.length) {
							establishments = JSON.parse(JSON.stringify(establishments));
							for (let index = 0; index < establishments.length; index++) {
								const establishment = establishments[index];
								console.log(
									"establishment.estIdentifyingKey === \n\n",
									establishment.estIdentifyingKey
								);
								await CommonFuction.updateEstAndUsers(establishment.estIdentifyingKey, {
									estStatus,
									userStatus
								})
							}
						} else {
							console.log(
								"#### Establishment not found for parentid ######\n\n"
							);
						}
					}
					result = { response: parent[1], statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
				} else {
					throw new Error(Message.SOMETHING_WENT_WRONG);
				}
			} else {
				result = {
					response,
					statusCode,
					success,
					error: {
						details: [
							{ message: response }
						]
					}
				};
			}
			return result;
		} catch (err) {
			logger.error(`Error at updateParentEstablishment - ${err}`)
			throw new Error(Message.SOMETHING_WENT_WRONG);
		}
	}

	async checkUserAssociateWithParent(parentId: number, userRoleId: number) {
		let establishments = await arrowup.establishments.findAll({
			where: {
				estParentId: parentId,
			},
			include: [{
				model: arrowup.users,
				attributes: ["id"],
				required: false,
				include: [{
					model: arrowup.userRoles,
					required: false,
					where: { id: userRoleId }
				}]
			}],
			attributes: [],
		});
		establishments = JSON.parse(JSON.stringify(establishments));
		for (const establishment of establishments) {
			for (const user of establishment.users) {
				if (user.userRole) {
					return true;
				}
			}
		}
		return false
	}

	async getParentEstablishments(ctx: Context): Promise<any> {
		const userId = ctx.state.user.id;
		const queryParams: any = ctx.query;
		const query = queryParams['searchText'];
		const pageNo = queryParams['page_no'];
		const pageSize = queryParams['page_size'];
		const status = queryParams['status'];
		const onlyUserEstablishment: boolean = queryParams['onlyUserEstablishment'];
		const where: any = {};

		const offset = pageNo,
			limit = pageSize;
		let skip = 0;
		if (offset >= 1) {
			skip = (offset - 1) * limit
		} else {
			skip = offset
		};

		if (status) {
			where.status = {
				[Op.eq]: status
			};
		}
		if (query) {
			where[Op.or] = [{
				estParentName: {
					[Op.iLike]: `%${query}%`
				}
			},
			];
		}
		// for only broker
		if (onlyUserEstablishment) {
			let parentEstablishmentIds = [];
			const userEstablishments = await arrowup.userEstablishments.findAll({
				where: { userId: userId },
				attributes: [],
				include: [
					{
						model: arrowup.establishments,
						attributes: ['estParentId'],
						required: false,
					}
				],
				order: [['estId', 'ASC']],
			})
			for (const userEstablishment of userEstablishments) {
				const parent = JSON.parse(JSON.stringify(userEstablishment))
				for (const parentEstablishments of parent.establishments) {
					parentEstablishmentIds.push(parentEstablishments.estParentId)
				}
			}
			where[Op.and] = [{
				estParentId: {
					[Op.in]: parentEstablishmentIds
				}
			}]
			const parentEstablishments = await arrowup.parentEstablishments.findAll({
				where,
				offset: skip,
				limit,
				order: [['estParentId', 'ASC']],

			});
			const total: number = await arrowup.parentEstablishments.count({
				where
			})

			return {
				response:
					parentEstablishments, total, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true
			};
		}



		console.log('where===0', where);
		const parents = await arrowup.parentEstablishments.findAll({
			where,
			offset: skip,
			limit,
			order: [['estParentId', 'ASC']],
		});
		const total: number = await arrowup.parentEstablishments.count({ where });
		return { response: parents, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true, total };
	}
	async getParentEstablishment(ctx: Context): Promise<any> {
		const id = ctx.params.id;
		const parent = await arrowup.parentEstablishments.findOne({
			where: { estParentId: id }, attributes: { exclude: ['estParentId'] }
		});
		if (parent) {
			return { response: parent, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
		} else {
			throw new Error(Message.SOMETHING_WENT_WRONG);
		}
	}
	async RoleAddAndUpdate(roles: any, id: number) {
		if (roles && roles.length) {
			console.log(roles, 'all roles RoleAddAndUpdate');

			roles.map(async (role: any) => {
				console.log("role.id", role.id);
				if (role.id) {
					const id = role.id;
					delete role.id;
					await arrowup.parentRoles.update(role, {
						where: { id },
					});
				} else {
					role.parentId = id;
					await arrowup.parentRoles.create(role);
				}
				return true
			});
		} else {
			return true
		}
	}
	async getParentRoles(ctx: Context): Promise<any> {
		const id = ctx.params.id;
		const parent = await arrowup.parentRoles.findAll({
			where: { parentId: id },
			include: [{
				model: arrowup.userRoles,
				// attributes: ['roleName', 'id', '']
			},
			{
				model: arrowup.parentEstablishments,
				attributes: ['estParentName']
			}]
		});
		if (parent) {
			return { response: parent, statusCode: HttpStatusCode.HTTP_SUCCESS_OK, success: true };
		} else {
			throw new Error(Message.SOMETHING_WENT_WRONG);
		}
	}
}

const ParentEstablishmentService: ParentEstablishment = new ParentEstablishment();
export default ParentEstablishmentService;
