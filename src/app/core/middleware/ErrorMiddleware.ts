import { Context } from 'koa';
import { decode } from 'jsonwebtoken';
import statusCode from '../../constant/HttpStatusCode';
import arrowup from '../../db/entity/arrowup';
import { Op } from 'sequelize';
import Messages from '../../constant/ErrorMessages';
import UserVariables from '../../constant/UserVariables';

class ErrorMiddleware {
	private getToken(ctx: Context) {
		const header = ctx.request.headers.authorization;
		if (!header) {
			return null;
		}
		const parts = header.split(' ');
		if (parts.length !== 2) {
			return null;
		}
		const scheme = parts[0];
		const token = parts[1];
		if (/^Bearer$/i.test(scheme)) {
			return token;
		}
		return null;
	}
	errorMiddleware() {
		return async (ctx: Context, next) => {
			try {
				await next();
			} catch (err) {
				ctx.status = err.status || 500;
				ctx.body = err.message;
				ctx.app.emit('error', err, ctx);
			}
		};
	}

	jwtMiddleWare() {
		const getToken = this.getToken;
		return async (ctx: Context, next) => {
			const token = getToken(ctx);
			if (!token) {
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
				return;
			}
			let decoded = null;
			try {
				decoded = decode(token);
				ctx.state.user = decoded;
				// console.log("decoded=", decoded)
				// The client's session has expired and must log in again.
				if (decoded.exp < Math.floor(Date.now() / 1000)) {
					ctx.status = statusCode.HTTP_UNAUTHORIZED;
					ctx.body = { error: { code: statusCode.HTTP_UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
					return;
				}
				const tokenFound = await arrowup.accessTokens.findOne({
					where: {
						userId: decoded['userId'],
						token
					}
				});
				if (!tokenFound) {
					throw new Error();
				}
				const user = await arrowup.users.findOne({ where: tokenFound.userId });
				ctx.state.token = token
				ctx.state.user = user;
				const where = {
					id: user.userRoleId,
					[Op.or]: [
						{ slug: UserVariables.SUPER_ADMIN_ROLE },
						{ slug: UserVariables.BROKER_ROLE }
					]
				}
				const isAdmin = await arrowup.userRoles.findOne({ where })
				console.log(isAdmin, 'user admin');
				if (!isAdmin) {
					const userAnswers = await arrowup.userAnswers.findOne({ where: { userId: user.id } })
					if (!userAnswers) {
						ctx.status = statusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
						ctx.body = { error: { code: Messages.SOMETHING_WENT_WRONG, http_code: statusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND } };
						return;
					}
				}
				return next();
			} catch (err) {
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
			}
		};
	}
	jwtMiddleWareForResetPassword() {
		const getToken = this.getToken;
		return async (ctx: Context, next) => {
			const token = getToken(ctx);
			if (!token) {
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
				return;
			}
			let decoded = null;
			try {
				decoded = decode(token);
				ctx.state.user = decoded;
				// The client's session has expired and must log in again.
				if (decoded.exp < Math.floor(Date.now() / 1000)) {
					ctx.status = statusCode.HTTP_UNAUTHORIZED;
					ctx.body = { error: { code: statusCode.HTTP_UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
					return;
				}
				const user = await arrowup.users.findOne({ where: { id: decoded.userId } });
				ctx.state.token = token
				ctx.state.user = user;
				return next();
			} catch (err) {
				console.log(err, 'jwtMiddleWareForResetPassword');
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
			}
		};
	}
	isAdmin(leadAuth = false, action = ''): any {
		const getToken = this.getToken;
		return async (ctx: Context, next) => {
			const token = getToken(ctx);
			if (!token) {
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
				return;
			}
			let decoded: any = null;
			try {
				decoded = decode(token);
				ctx.state.user = decoded;
				const roles = [UserVariables.SUPER_ADMIN_ROLE];
				if (leadAuth) {
					roles.push(UserVariables.SAFETY_LEAD_ROLE);
				}
				console.log(roles);
				const where: any = {
					slug: { [Op.in]: roles }
				};
				// find ids of roles from db
				const eligibleRoles = await arrowup.userRoles.findAll({
					where,
					plan: true
				});
				if (eligibleRoles && eligibleRoles.length) {
					const ids: any = eligibleRoles.map((val: any) => val.id);
					console.log(eligibleRoles, 'adminRole', ids);
					const tokenFound = await arrowup.accessTokens.findOne({
						include: {
							model: arrowup.users,
							where: {
								userRoleId: { [Op.in]: ids }
							}
						},
						where: {
							userId: decoded['userId'],
							token,
						}
					});
					console.log(tokenFound, 'tokenFoundtokenFoundtokenFound');
					if (!tokenFound) {
						throw new Error();
					}
					const where: any = { id: tokenFound.userId };
					const safteyLeadIds: any = [];
					const user = await arrowup.users.findOne({ where });
					console.log('user===========', user, leadAuth, action);
					if (leadAuth && action == 'create') {
						// check if its not admin
						const adminRole: any = (eligibleRoles.find((e: any) => { return e.slug == UserVariables.SUPER_ADMIN_ROLE; })).id;
						console.log('adminRole-------------', adminRole, user.userRoleId);
						if (user.userRoleId !== adminRole) {
							console.log('lead condition');
							const otherRoles: any = await arrowup.userRoles.findAll(
								{
									where: {
										slug: {
											[Op.in]: UserVariables.SAFTEY_LEAD_ROLES_PERMISSION
										},
									},
									plan: true
								});
							// check lead belongs to same establishment
							const otherRolesIds: any = otherRoles.map((val: any) => val.id);
							console.log('otherRolesIds---', user.estIdentifyingKey != ctx.request.body['estIdentifyingKey'], '||', otherRolesIds.indexOf(ctx.request.body['userRoleId']));
							if (user.estIdentifyingKey != ctx.request.body['estIdentifyingKey'] || otherRolesIds.indexOf(ctx.request.body['userRoleId']) == -1) {
								throw new Error();
							}
						}
					}
					if (leadAuth && action == 'update') {
						// check if its not admin
						const adminRole: any = (eligibleRoles.find((e: any) => { return e.slug == UserVariables.SUPER_ADMIN_ROLE; })).id;
						console.log('adminRole-------------', adminRole, user.userRoleId);
						if (user.userRoleId !== adminRole) {
							console.log('lead condition');
							// check lead belongs to same establishment
							console.log('otherRolesIds---', user.estIdentifyingKey, "=", ctx.params['estId']);
							if (user.estIdentifyingKey != ctx.params['estId']) {
								throw new Error();
							}
						}
					}
					ctx.state.user = user;
				}
				return next();
			} catch (err) {
				console.log('err', err);
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
			}
		};
	}
	isAdminOrEst(): any {
		const getToken = this.getToken;
		return async (ctx: Context, next) => {
			const token = getToken(ctx);
			let decoded: any = null;
			try {
				decoded = decode(token);
				console.log('decoded', decoded, ctx.request.body);
				ctx.state.user = decoded;
				const user: any = ctx.request.body;
				const roles = [UserVariables.SUPER_ADMIN_ROLE];
				console.log(roles);
				const where: any = {
					slug: { [Op.in]: roles }
				};
				// find ids of roles from db
				const eligibleRoles = await arrowup.userRoles.findAll({
					where,
					plan: true
				});
				if (eligibleRoles && eligibleRoles.length) {
					const ids: any = eligibleRoles.map((val: any) => val.id);
					console.log(eligibleRoles, 'adminRole', ids);
					const tokenFound = await arrowup.accessTokens.findOne({
						include: {
							model: arrowup.users,
							where: {
								userRoleId: { [Op.in]: ids }
							}
						},
						where: {
							userId: decoded ? decoded['userId'] : null,
							token,
						}
					});
					console.log('user=', user);
					console.log(tokenFound, '-token-', user.withinEst);
					if (!tokenFound && user.withinEst) {
						return next();
					} else if (tokenFound) {
						return next();
					} else {
						throw new Error();
					}
				}
			} catch (err) {
				console.log('err', err);
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
			}
		};
	}
	isUserEstablishment(): any {
		const getToken = this.getToken;
		return async (ctx: Context, next) => {
			const token = getToken(ctx);
			let decoded: any = null;
			try {
				decoded = decode(token);
				ctx.state.user = decoded;
				const userId: number = ctx.state.user.userId
				const establishmentId: number = ctx.params.estId

				let user = await arrowup.users.findOne({
					where: { id: userId },
					attributes: [
						"userRoleId"
					]
				})
				user = JSON.parse(JSON.stringify(user));
				const userRoleId = user.userRoleId;
				const where: any = {
					id: userRoleId,
					slug: UserVariables.BROKER_ROLE
				}
				const isBroker = await arrowup.userRoles.findOne({ where })
				if (!isBroker) {
					return next()
				}
				const userEstablishment = await arrowup.userEstablishments.findOne({
					where: { userId: userId, estId: establishmentId }
				})
				if (userEstablishment) {
					return next()
				} else {
					throw new Error();
				}
			} catch (err) {
				console.log('err', err);
				ctx.status = statusCode.HTTP_UNAUTHORIZED;
				ctx.body = { error: { code: Messages.UNAUTHORIZED, http_code: statusCode.HTTP_UNAUTHORIZED } };
			}

		}

	}
}
const errorMiddleware: ErrorMiddleware = new ErrorMiddleware();
export default errorMiddleware;
