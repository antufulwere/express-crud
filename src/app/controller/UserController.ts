import { Context } from 'koa';
import logger from '../../logger';
import { Result } from "../utils/Interface"
import errorHandler from '../utils/ApiErrorHandler';
import userService from '../service/UserService';
import apiResponseHandler from '../constant/ResponseHandler';
import userValidator from '../validator/UserValidator';

class UserController {
	constructor() { }

	async addUser(ctx: Context) {
		try {
			logger.info(`Controller : addUser, Request Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const validator: any = await userValidator.checkPermitedRoles(ctx)
			let result: any = { success: true }
			if (validator.success) {
				result = await userService.addUser(ctx, null);
			}
			if (!result.success || !validator.success) {
				apiResponseHandler.errorHandler(ctx, validator.success == false ? validator.error : result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addUser, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async addUserByCsv(ctx: Context) {
		try {
			logger.info(`Controller : addUser, Request Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const validator: any = await userValidator.checkPermitedRoles(ctx)
			let result: Result = { success: true, response: {}, statusCode: 0 }
			if (validator.success) {
				result = await userService.addUserByCsv(ctx, null);
			}
			if (!result.success || !validator.success) {
				apiResponseHandler.errorHandler(ctx, validator.success == false ? validator.error : result.response)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addUser, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async forgotPassword(ctx: Context) {
		try {
			logger.info(`Controller : forgotPassword, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.forgotPassword(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: forgotPassword, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async adminResetPassword(ctx: Context) {
		try {
			logger.info(`Controller : adminResetPassword, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.adminResetPassword(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: adminResetPassword, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateUser(ctx: Context) {
		try {
			logger.info(`Controller : updateUser, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);

			const { response, statusCode, success, error } = await userService.updateUser(ctx);
			if (!success) {
				apiResponseHandler.errorHandler(ctx, error);
			} else {
				apiResponseHandler.response(ctx, response, success, statusCode);

			}

		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateUser, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async getUsers(ctx: Context) {
		try {
			logger.info(`Controller : getUsers, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success, total } = await userService.getUsers(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode, total);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUsers, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUser(ctx: Context) {
		try {
			logger.info(`Controller : getUser, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success } = await userService.getUser(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUser, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async login(ctx: Context) {
		try {
			logger.info(`Controller : login, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success, error } = await userService.login(ctx);
			if (!success) {
				apiResponseHandler.errorHandler(ctx, error);
			} else {
				apiResponseHandler.response(ctx, response, success, statusCode);

			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: login, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async googleLogin(ctx: Context) {
		try {
			logger.info(`Controller : googleLogin, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result: Result = await userService.googleLogin(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error);
			} else {
				ctx.response.set('Content-Type', 'text/csv');
				ctx.response.set('Content-Disposition', 'attachment; filename=activeUsers.csv');
				ctx.response.body = result.response
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: googleLogin, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async logout(ctx: Context) {
		try {
			logger.info(`Controller : logout, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success } = await userService.logout(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: logout, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async changePassword(ctx: Context) {
		try {
			logger.info(`Controller : changePassword, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success } = await userService.changePassword(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: changePassword, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async resetAuth(ctx: Context) {
		try {
			logger.info(`Controller : resetAuth, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success } = await userService.resetAuth(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: resetAuth, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async resetPassword(ctx: Context) {
		try {
			logger.info(`Controller : resetPassword, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const { response, statusCode, success } = await userService.resetPassword(ctx);
			apiResponseHandler.response(ctx, response, success, statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: resetPassword, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getProfile(ctx: Context) {
		try {
			logger.info(`Controller : getProfile, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getProfile(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error);
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode);

			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getProfile, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getPositions(ctx: Context) {
		try {
			logger.info(`Controller : getPositions, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getPositions(ctx);
			apiResponseHandler.response(ctx, result.response, result.success, result.statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getPositions, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async sendFeedback(ctx: Context) {
		try {
			logger.info(`Controller : getPositions, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const validator: any = await userValidator.userFeedback(ctx)
			let result: any = { success: true }
			if (!validator) {
				result = await userService.sendFeedback(ctx);
			}
			console.log(validator, "validator")
			if (!result.success || validator) {
				apiResponseHandler.errorHandler(ctx, validator ? validator : result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getPositions, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUserCourses(ctx: Context) {
		try {
			logger.info(`Controller : getUserCourses, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getUserCourses(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserCourses, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUserChecklists(ctx: Context) {
		try {
			logger.info(`Controller : getUserChecklists, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getUserChecklists(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserChecklists, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateUserChecklist(ctx: Context) {
		try {
			logger.info(`Controller : updateUserChecklist, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.updateUserChecklist(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateUserChecklist, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateUserTraining(ctx: Context) {
		try {
			logger.info(`Controller : updateUserTraining, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.updateUserTraining(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateUserTraining, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUserCourseDetails(ctx: Context) {
		try {
			logger.info(`Controller : getUserCourseDetails, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getUserCourseDetails(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserCourseDetails, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getChecklistsOfUser(ctx: Context) {
		try {
			logger.info(`Controller : getChecklistsOfUser, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getChecklistsOfUser(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getChecklistsOfUser, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async check(ctx: Context) {
		try {
			logger.info(`Controller : check, Request-Body : ${JSON.stringify(ctx.request)} date: ${new Date()}`);
			apiResponseHandler.response(ctx, "Success", true, 200)
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addCourse, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getUsersByCourseId(ctx: Context) {
		try {
			logger.info(`Controller : getUsersByCourseId, Request-params : ${JSON.stringify(ctx.params)}`, `date: ${new Date()}`);
			const result = await userService.getUsersByCourseId(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUsersByCourseId, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getSummary(ctx: Context) {
		try {
			logger.info(`Controller : getSummaryDetails, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getSummary(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getSummaryDetails, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getQuestions(ctx: Context) {
		try {
			logger.info(`Controller : getUserQuestions, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getQuestions(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserQuestions, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getQuestionsOnBehalfOfEmail(ctx: Context) {
		try {
			logger.info(`Controller : getQuestionsOnBehalfOfEmail, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getQuestionsOnBehalfOfEmail(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getQuestionsOnBehalfOfEmail, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async forgotUserPassword(ctx: Context) {
		try {
			logger.info(`Controller : forgotUserPassword, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.forgotUserPassword(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserQuestions, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async addUserEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : addUserEstablishment, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.addUserEstablishment(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log('##### addUserEstablishment #####', error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addUserEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async getUserEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : getUserEstablishment, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getUserEstablishment(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log('getUserEstablishment', error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async deleteUserEstablishment(ctx: Context) {
		try {
			logger.info(`Controller : deleteUserEstablishment, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.deleteUserEstablishment(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log('deleteUserEstablishment', error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: deleteUserEstablishment, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async checkUserAnswer(ctx: Context) {
		try {
			logger.info(`Controller : checkUserAnswer, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.checkUserAnswer(ctx);
			console.log(result);

			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: checkUserAnswer, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async addAnswer(ctx: Context) {
		try {
			logger.info(`Controller : addAnswer, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.addAnswer(ctx);
			console.log(result);

			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addAnswer, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async addUserEstablishmentImages(ctx: Context) {
		try {
			logger.info(`Controller : addUserEstablishmentImages, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.addUserEstablishmentImages(ctx);
			console.log(result);

			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: addUserEstablishmentImages, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async getUserEstablishmentImages(ctx: Context) {
		try {
			logger.info(`Controller : getUserEstablishmentImages, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.getUserEstablishmentImages(ctx);
			console.log(result);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getUserEstablishmentImages, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async updateUserEstablishmentImages(ctx: Context) {
		try {
			logger.info(`Controller : updateUserEstablishmentImages, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.updateUserEstablishmentImages(ctx);
			console.log(result);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateUserEstablishmentImages, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async deleteUserEstablishmentImages(ctx: Context) {
		try {
			logger.info(`Controller : deleteUserEstablishmentImages, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result = await userService.deleteUserEstablishmentImages(ctx);
			console.log(result);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: deleteUserEstablishmentImages, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}

	async downloadUserCsv(ctx: Context) {
		try {
			logger.info(`Controller : downloadUserCsv, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result: any = await userService.downloadUserCsv(ctx);
			console.log(result, 'result');
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error);
			} else {
				ctx.response.set('Content-Type', 'text/csv');
				ctx.response.set('Content-Disposition', 'attachment; filename=activeUsers.csv');
				ctx.response.body = result.response
			}
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: downloadUserCsv, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async trainingDurationStatistics(ctx: Context) {
		try {
			logger.info(`Controller : trainingDurationOfUser, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result: Result = await userService.trainingDurationStatistics(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: trainingDurationOfUser, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async userTrainingStatistics(ctx: Context) {
		try {
			logger.info(`Controller : userTrainingStatistics, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result: Result = await userService.userTrainingStatistics(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: userTrainingStatistics, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async getTrainingByParentIdOrEstId(ctx: Context) {
		try {
			logger.info(`Controller : getTrainingByParentIdOrEstId, Request-Body : ${JSON.stringify(ctx.request.body)}`, `date: ${new Date()}`);
			const result: Result = await userService.getTrainingByParentIdOrEstId(ctx);
			if (!result.success) {
				apiResponseHandler.errorHandler(ctx, result.error)
			} else {
				apiResponseHandler.response(ctx, result.response, result.success, result.statusCode)
			}
		} catch (error) {
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: getTrainingByParentIdOrEstId, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
	async updateUserRole(ctx: Context) {
		try {
			 logger.info(`Controller : updateUserRole, Request-Body : ${JSON.stringify(ctx.params)} date: ${new Date()}`);
			const result: Result = await userService.updateUserRole(ctx);
			apiResponseHandler.response(ctx, result.response, result.success, result.statusCode);
		} catch (error) {
			console.log(error);
			const errorMessage: string = errorHandler.errorHandler(ctx, error);
			logger.error(`Controller: updateUserRole, Error: ${JSON.stringify(errorMessage)}`, `date: ${new Date()}`);
		}
	}
}

const userController: UserController = new UserController();
export default userController;
