import { Context, Next } from "koa";
import Joi from "joi";
import errorHandler from "../utils/ApiErrorHandler";
import logger from "../../logger";
import arrowup from "../db/entity/arrowup";
import Message from "../constant/Messages";
import HttpStatusCode from "../constant/HttpStatusCode";
import { Op } from "sequelize";
import UserVariables from "../constant/UserVariables";
import moment from "moment";
import apiResponseHandler from "../constant/ResponseHandler";
class UserValidator {
  constructor() { }
  async createUser(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        userFirstName: Joi.string().required(),
        userLastName: Joi.string().required(),
        userEmailId: Joi.string().email().optional(),
        userContactNumber: Joi.string().optional(),
        userPosition: Joi.number().optional(),
        userRoleId: Joi.number().required(),
        password: Joi.string().optional().allow(""),
        withinEst: Joi.boolean().optional(),
        estIdentifyingKey: Joi.string().length(10).optional(),
        countryIsoCode: Joi.string().optional(),
        countryIsdCode: Joi.string().optional(),
        employeeCode: Joi.string().required(),
        answers: Joi.array()
          .items({
            id: Joi.number().optional(),
            answer: Joi.string().required(),
            questionId: Joi.number().required(),
          })
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: createUser, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: createUser, Error: ${errorMessage}`);
      return;
    }
  }
  // password passwordConfirmation userRoleId
  async resetPassword(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        userRoleId: Joi.number().required(),
        password: Joi.string().required(),
        // userId: Joi.string().required(),
        // passwordConfirmation: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: resetPassword, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: resetPassword, Error: ${errorMessage}`);
      return;
    }
  }
  async changePassword(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        userRoleId: Joi.number().required(),
        password: Joi.string().required(),
        oldPassword: Joi.string().required(),
        // passwordConfirmation: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: resetPassword, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: changePassword, Error: ${errorMessage}`);
      return;
    }
  }

  async resetAuth(ctx: Context, next: Next): Promise<any | void> {
    try {
      console.log('resetAuth--------------------------------')
      const paramsValidation = Joi.number().required()
      const param = ctx.params.id;
      if (!param) {
        console.log('Id is required');
      }
      const { error } = paramsValidation.validate(param);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: resetAuth, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: resetAuth, Error: ${errorMessage}`);
      return;
    }
  }

  async loginUser(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        type: Joi.string().valid("user", "broker", "admin").optional(),
        user: Joi.string().optional(),
        password: Joi.string().optional(),
        '2FACode': Joi.string().length(6).optional(),
        email: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: loginUser, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: loginUser, Error: ${errorMessage}`);
      return;
    }
  }

  async googleLogin(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        access_token: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: loginUser, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: loginUser, Error: ${errorMessage}`);
      return;
    }
  }

  async getUsersByCourseId(ctx: Context, next: Next): Promise<any | void> {
    try {
      const paramValidation = Joi.object({
        estId: Joi.number().required(),
      });
      const queryValidation = Joi.object({
        courseId: Joi.number().optional(),
        trainingId: Joi.number().optional(),
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional(),
      });
      const paramValidationResult = paramValidation.validate(ctx.params);
      const queryValidationResult = queryValidation.validate(ctx.query);
      if (paramValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, paramValidationResult.error);
        logger.error(`Validation: getUsersByCourseId, Error: ${errorMessage}`);
        return;
      }
      if (queryValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, queryValidationResult.error);
        logger.error(`Validation: getUsersByCourseId, Error: ${errorMessage}`);
        return;
      }
      const estId: number = ctx?.params?.estId;
      let estData = await arrowup.establishments.findOne({
        attributes: ['estIdentifyingKey', 'estParentId'],
        where: {
          estIdentifyingKey: estId,
        },
      });
      if (!estData) {
        return {
          response: Message.EST_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.EST_NOT_FOUND }],
          },
        };
      }
      estData = JSON.parse(JSON.stringify(estData));
      let establishmentCourseInfosData = await arrowup.establishmentCourseInfos.findAll({
        attributes: ['estId', 'courseId'],
        where: {
          estId: estData.estIdentifyingKey,
        },
      });
      if (!establishmentCourseInfosData) {
        return {
          response: Message.ESTABLISHMENT_COURSE_DATA_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.ESTABLISHMENT_COURSE_DATA_NOT_FOUND }],
          },
        };
      }
      establishmentCourseInfosData = JSON.parse(JSON.stringify(establishmentCourseInfosData));
      const query: {
        courseId?: number;
        trainingId?: number;
      } = ctx.request.query;
      if (query.courseId) {
        const courseExists = await arrowup.courses.findOne({
          where: {
            id: query.courseId,
          },
        });
        if (!courseExists) {
          // Handle the case where the course does not exist
          return {
            response: Message.INVALID_COURSE_ID,
            statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
            success: false,
            error: {
              details: [{ message: Message.INVALID_COURSE_ID }],
            },
          };
        }
      }
      const courseIds = establishmentCourseInfosData.map((ele) => {
        if (ele.courseId) {
          return ele.courseId;
        }
      })
      ctx.request['courseIds'] = courseIds;
      if (query.trainingId) {
        const trainingExist = await arrowup.trainings.findOne({
          where: {
            trainingId: query.trainingId,
          }
        })
        if (!trainingExist) {
          // Handle the case where the trining does not exist
          return {
            response: Message.INVALID_TRAINING_ID,
            statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
            success: false,
            error: {
              details: [{ message: Message.INVALID_TRAINING_ID }],
            },
          };
        }
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: loginUser, Error: ${errorMessage}`);
      return;
    }
  }
  async updateUser(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        userFirstName: Joi.string().optional(),
        userLastName: Joi.string().optional(),
        userEmailId: Joi.string().allow("").optional(),
        userContactNumber: Joi.string().optional(),
        userPosition: Joi.number().optional(),
        userRoleId: Joi.number().optional(),
        isDeleted: Joi.boolean().optional(),
        countryIsoCode: Joi.string().optional(),
        countryIsdCode: Joi.string().optional(),
        textBox: Joi.string().allow("").optional(),
        isChecked: Joi.boolean().optional(),
        employeeCode: Joi.number().optional(),
        answers: Joi.array()
          .items({
            id: Joi.number().optional(),
            answer: Joi.string().required(),
            questionId: Joi.number().required(),
          }),
        deleteAnswers: Joi.array()
          .items(Joi.number()).optional(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: updateUser, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: updateUser, Error: ${errorMessage}`);
      return;
    }
  }
  async userAlreadyExistCheck(body: object, id: string) {
    const where: any = { userName: body["userName"] };

    if (body["userRoleId"]) {
      where.userRoleId = body["userRoleId"];
    }

    if (id) {
      where.id = {
        [Op.not]: id,
      };
    }
    const alreadyCreatedUser = await arrowup.users.findOne({
      where,
    });
    return alreadyCreatedUser ? Message.USER_ALREADY_EXISTS : false;
  }
  async userFeedback(ctx: Context): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        estId: Joi.number().required(),
        feedback: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: userFeedback, Error: ${errorMessage}`);
        throw error;
      }
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: updateUser, Error: ${errorMessage}`);
      throw error;
    }
  }
  async checkPermitedRoles(ctx: Context) {
    const body: any = ctx.request.body;
    const roles: any = UserVariables.FORBBIDEN_ROLES;
    let result: any = { success: true };
    if (body.estIdentifyingKey) {
      if (body.userRoleId) {
        const role: any = await arrowup.userRoles.findOne({
          where: {
            id: body.userRoleId,
          },
        });
        if (role) {
          if (roles.indexOf(role.roleName) > -1) {
            result = {
              response: Message.ROLE_RESTRICT,
              statusCode: HttpStatusCode.HTTP_FORBIDDEN,
              success: false,
              error: {
                details: [{ message: Message.ROLE_RESTRICT }],
              },
            };
          }
        } else {
          result = {
            response: Message.ROLE_NOT_FOUND,
            statusCode: HttpStatusCode.HTTP_FORBIDDEN,
            success: false,
            error: {
              details: [{ message: Message.ROLE_NOT_FOUND }],
            },
          };
        }
      }
    }
    return result;
  }
  async updateUserTraining(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        isCompleted: Joi.boolean().optional(),
        startedOn: Joi.string().optional(),
        completedOn: Joi.string().optional(),
        lastAccessedOn: Joi.string().optional(),
        durationCompleted: Joi.string().optional(),
        trainingStatus: Joi.string()
          .valid("NOT_STARTED", "COMPLETED", "IN_PROGRESS")
          .optional(),
        isActive: Joi.boolean().optional(),
        markAbsent: Joi.boolean().optional(),
        chapterCompleted: Joi.number().optional(),
        chapterAssign: Joi.number().optional(),
        resumeSession: Joi.object().optional(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: updateUserTraining, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: updateUserTraining, Error: ${errorMessage}`);
      return;
    }
  }
  async updateUserChecklist(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        checklistResponse: Joi.object().optional(),
        isActive: Joi.boolean().optional(),
        isCompleted: Joi.boolean().optional(),
        markAbsent: Joi.boolean().optional(),
        completedOn: Joi.string().optional(),
        deleteLinks: Joi.array()
          .items(Joi.string()).optional(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: updateUserChecklist, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: updateUserChecklist, Error: ${errorMessage}`);
      return;
    }
  }
  async forgotPassword(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        email: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: forgotPassword, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: forgotPassword, Error: ${errorMessage}`);
      return;
    }
  }
  async adminResetPassword(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        resetPasswordToken: Joi.string().required(),
        password: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: adminResetPassword, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: adminResetPassword, Error: ${errorMessage}`);
      return;
    }
  }

  async addUserEstablishment(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        userEstablishment: Joi.array()
          .items({
            userId: Joi.number().required(),
            establishmentIds: Joi.array()
              .items(Joi.number()).required(),
          })
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: addUserEstablishment, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: addUserEstablishment, Error: ${errorMessage}`);
      return;
    }
  }

  async addUserEstablishmentImages(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        estId: Joi.number().required(),
        imageKey: Joi.string().required(),
        imageUrl: Joi.string().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: addUserEstablishmentImages, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: addUserEstablishment, Error: ${errorMessage}`);
      return;
    }
  }

  async updateUserEstablishmentImages(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        estId: Joi.number().optional(),
        imageKey: Joi.string().optional(),
        imageUrl: Joi.string().optional(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: updateUserEstablishmentImages, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: updateUserEstablishmentImages, Error: ${errorMessage}`);
      return;
    }
  }

  async checkUserAnswer(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        answer: Joi.string().required(),
        questionId: Joi.number().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: checkUserAnswer, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: checkUserAnswer, Error: ${errorMessage}`);
      return;
    }
  }

  async createAnswer(ctx: Context, next: Next): Promise<any | void> {
    try {
      const bodyValidation = Joi.object({
        answers: Joi.array()
          .items({
            id: Joi.number().optional(),
            answer: Joi.string().required(),
            questionId: Joi.number().required(),
          })
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: checkUserAnswer, Error: ${errorMessage}`);
        return;
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: checkUserAnswer, Error: ${errorMessage}`);
      return;
    }
  }

  async downloadUserCsv(ctx: Context, next: Next): Promise<any | void> {
    try {
      const paramValidation = Joi.object({
        estId: Joi.number().required(),
      });
      const queryValidation = Joi.object({
        courseId: Joi.number().optional(),
        trainingId: Joi.number().optional(),
        trainingStatus: Joi.string().optional().allow(''),
      });
      const paramValidationResult = paramValidation.validate(ctx.params);
      const queryValidationResult = queryValidation.validate(ctx.query);

      if (paramValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, paramValidationResult.error);
        logger.error(`Validation: downloadUserCsv, Error: ${errorMessage}`);
        return;
      }
      if (queryValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, queryValidationResult.error);
        logger.error(`Validation: downloadUserCsv, Error: ${errorMessage}`);
        return;
      }
      const estId: number = ctx?.params?.estId;
      let estData = await arrowup.establishments.findOne({
        attributes: ['estIdentifyingKey', 'estParentId'],
        where: {
          estIdentifyingKey: estId,
        },
      });

      if (!estData) {
        return {
          response: Message.EST_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.EST_NOT_FOUND }],
          },
        };
      }
      estData = JSON.parse(JSON.stringify(estData));
      ctx.request.body.estData = estData;
      let establishmentCourseInfosData = await arrowup.establishmentCourseInfos.findOne({
        attributes: ['estId', 'courseId'],
        where: {
          estId: estData.estIdentifyingKey,
        },
      });

      // if (!establishmentCourseInfosData) {
      //   return {
      //     response: Message.ESTABLISHMENT_COURSE_DATA_NOT_FOUND,
      //     statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
      //     success: false,
      //     error: {
      //       details: [{ message: Message.ESTABLISHMENT_COURSE_DATA_NOT_FOUND }],
      //     },
      //   };
      // }
      if (establishmentCourseInfosData) {
        establishmentCourseInfosData = JSON.parse(JSON.stringify(establishmentCourseInfosData));
      }
      ctx.request.body.establishmentCourseInfosData = establishmentCourseInfosData;
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: loginUser, Error: ${errorMessage}`);
      return;
    }
  }

  async trainingDurationStatistics(ctx: Context, next: Next): Promise<any | void> {
    try {
      const queryValidation = Joi.object({
        userId: Joi.number().optional(),
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional(),
      });
      const queryValidationResult = queryValidation.validate(ctx.query);
      if (queryValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, queryValidationResult.error);
        logger.error(`Validation: getTotalTrainingDurationOfUser, Error: ${errorMessage}`);
        return;
      }
      const query: {
        userId?: number;
      } = ctx.request.query;
      if (query.userId) {
        const isUserExists = await arrowup.users.findOne({
          where: {
            id: query.userId,
            isActive: true,
          },
        });
        if (!isUserExists) {
          // Handle the case where the user does not exist
          ctx.body = { error: Message.INVALID_USER_ID };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
      };
      return next();
    } catch (error) {
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: getTotalTrainingDurationOfUser, Error: ${errorMessage}`);
      return;
    }
  }

  async userTrainingStatistics(ctx: Context, next: Next): Promise<any | void> {
    try {
      const queryValidation = Joi.object({
        userId: Joi.number().optional(),
        trainingId: Joi.number().optional(),
        checklistId: Joi.number().optional(),
        trainingStatus: Joi.string().optional(),
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional(),
      });
      const queryValidationResult = queryValidation.validate(ctx.query);
      if (queryValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, queryValidationResult.error);
        logger.error(`Validation: totalCount, Error: ${errorMessage}`);
        return;
      }
      const query: {
        userId?: number;
        trainingId?: number;
        checklistId?: number;
        trainingStatus?: string;
      } = ctx.request.query;
      if (query.userId) {
        const isUserExists = await arrowup.users.findOne({
          where: {
            id: query.userId,
            isActive: true,
          },
        });
        if (!isUserExists) {
          // Handle the case where the user does not exist
          ctx.body = { error: Message.INVALID_USER_ID };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
      };
      if (query.trainingId) {
        const isTrainingExist = await arrowup.trainings.findOne({
          where: {
            trainingId: query.trainingId,
          },
        });
        if (!isTrainingExist) {
          // Handle the case where the trining does not exist
          ctx.body = { error: Message.INVALID_TRAINING_ID };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
      };
      if (query.checklistId) {
        const isChecklistExist = await arrowup.checklists.findOne({
          where: {
            id: query.checklistId,
          },
          attributes: ['id', 'isDeleted', 'thumbnailUrl']
        });
        if (!isChecklistExist) {
          // Handle the case where the trining does not exist
          ctx.body = { error: Message.INVALID_CHECKLIST_ID };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
      };
      if (query.trainingStatus) {
        const userCourseTrainingStatusExist = await arrowup.userCourseTrainings.findAll({
          where: {
            trainingStatus: query.trainingStatus,
            isActive: true,
          },
        });
        if (!userCourseTrainingStatusExist) {
          // Handle the case where the training-status does not exist
          ctx.body = { error: Message.INVALID_TRAINING_STATUS };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: totalCount, Error: ${errorMessage}`);
      return;
    }
  }

  async getTrainingByParentIdOrEstId(ctx: Context, next: Next): Promise<any | void> {
    try {
      const queryValidation = Joi.object({
        estId: Joi.number().optional(),
        parentId: Joi.number().optional(),
      });
      const queryValidationResult = queryValidation.validate(ctx.query);
      if (queryValidationResult.error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, queryValidationResult.error);
        logger.error(`Validation: getTraining, Error: ${errorMessage}`);
        return;
      }
      const query: {
        estId?: number;
        parentId?: number;
      } = ctx.request.query;
      if (query.parentId) {
        let isEstablishmentExists = await arrowup.establishments.findOne({
          where: {
            estParentId: query.parentId,
          },
        });
        if (!isEstablishmentExists) {
          // Handle the case where the establishments does not exist
          ctx.body = { error: Message.EST_NOT_FOUND };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
        isEstablishmentExists = JSON.parse(JSON.stringify(isEstablishmentExists));
        ctx.request['isEstablishmentExists'] = isEstablishmentExists;
      };
      if (query.estId) {
        const isEstablishmentExists = await arrowup.establishments.findOne({
          where: {
            estIdentifyingKey: query.estId,
          },
        });
        if (!isEstablishmentExists) {
          // Handle the case where the user does not exist
          ctx.body = { error: Message.EST_NOT_FOUND };
          ctx.status = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND;
          ctx.success = false;
          return;
        }
      };
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: getTraining, Error: ${errorMessage}`);
      return;
    }
  }
  async updateUserRole(ctx: Context, next: Next): Promise<any | void> {
    try {
      const userId = ctx.request.body.userId
      const bodyValidation = Joi.object({
        roleId: Joi.number().required(),
        userId: Joi.number().required(),
      });
      const body = ctx.request.body;
      const { error } = bodyValidation.validate(body);
      if (error) {
        const errorMessage: string = errorHandler.errorHandler(ctx, error);
        logger.error(`Validation: updateUserRole, Error: ${errorMessage}`);
        return;
      }
      const isUserExist = await arrowup.users.findOne({
        where: {
          id: userId,
        }
      });
      if (!isUserExist) {
        const success = false,
          response = Message.USER_NOT_FOUND,
          statusCode = HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND
        return apiResponseHandler.response(ctx, response, success, statusCode);
      }
      return next();
    } catch (error) {
      console.log(error);
      const errorMessage: string = errorHandler.errorHandler(ctx, error);
      logger.error(`Validation: updateUserRole, Error: ${errorMessage}`);
      return;
    }
  }
}

const userValidators: UserValidator = new UserValidator();
export default userValidators;
