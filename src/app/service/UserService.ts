import { Context } from "koa";
import arrowup from "../db/entity/arrowup";
import Message from "../constant/Messages";
import HttpStatusCode from "../constant/HttpStatusCode";
import Validations from "../validator/UserValidator";
import UserVariables from "../constant/UserVariables";
import Sequelize, { Op } from "sequelize";
import CommonFunction from "../utils/CommonFunction";
import Token from "../third-party/jwt";
import ApiCall from "../third-party/axios";
import bcrypt from "bcrypt";
import config from "../../resources/config";
import moment from "moment";
import EstablishmentService from "./EstablishmentService";
import _ from "lodash";
import imageHandler from "../utils/ImageHandler";
import { CommonResponse, Result } from "../utils/Interface";
import { use } from "koa-passport";
import TOTP from 'totp.js';
import { TwoFAHandler } from "../utils/2FAHandler";
import csv from 'csvtojson';
import * as fastcsv from 'fast-csv';

class UserService {
  constructor() { }

  async addUser(ctx: Context, transaction?: any): Promise<any> {
    const body: any = ctx.request.body;
    const userAnswers = body.answers;
    console.log("In function addUser");
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const role = await arrowup.userRoles.findOne({
      where: {
        id: body["userRoleId"],
      },
    });
    if (!role) {
      response = Message.INVALID_ROLE;
      success = false;
    }
    body["userName"] = `${body["userFirstName"]}-${body["userLastName"]}${body["userEmailId"] ? "-" + body["userEmailId"] : ""
      }${body["estIdentifyingKey"] ? "-" + body["estIdentifyingKey"] : ""}`;
    const alreadyCreatedUser = await Validations.userAlreadyExistCheck(
      body,
      null
    );
    if (alreadyCreatedUser) {
      response = Message.USER_ALREADY_EXISTS;
      success = false;
    }
    if (!success) {
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      body.createdOn = new Date()
      body.userDateOfJoining = new Date()
      body['2FAKey'] = TOTP.randomKey()

      let user: any = await arrowup.users.create(body);
      if (user) {
        const message = Message.EMAIL.SUBJECT;
        const sendData: any = {
          establishment: '',
          estId: user.estIdentifyingKey,
          email: user.userEmailId,
          comment: message,
          name: `${user.userFirstName} ${user.userLastName}`,
          username: user.userName,
          password: body.password,
          link: config.link,
          logo: config.logo,
          sendWelcomeMail: true,
        };
        // Use the email service to send the email
        let success = await ApiCall.makePostCall(config.notificationApi, sendData);
        await this.establishRelationBetweenCourseAndEmployee(
          user.dataValues.id
        );
        await CommonFunction.establishRelationBetweenChecklistAndEmployee(
          user.dataValues.id
        );
        if (userAnswers && userAnswers.length) {
          userAnswers.forEach((userAnswer: any) => {
            userAnswer.answer = userAnswer.answer.toLowerCase();
            Object.assign(userAnswer, { userId: user.dataValues.id });
            Object.assign(userAnswer, { createdOn: body.createdOn });
          });
          await arrowup.userAnswers.bulkCreate(
            userAnswers
          );
        }
        delete user.dataValues.password;
        user.dataValues.qrCode = await TwoFAHandler.get2FABase64QR(body?.userFirstName, body['2FAKey'])
        result = {
          response: user.dataValues,
          statusCode: HttpStatusCode.HTTP_CREATED,
          success: true
        };
      } else {
        console.log('99999999999999999999999999 \n\n');
        throw new Error(Message.SOMETHING_WENT_WRONG);
      }
    }
    console.log('?????????????? ', result);
    return result;
  }

  async addUserByCsv(ctx: Context, transaction?: any): Promise<CommonResponse> {
    const body: any = ctx.request.body;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};

    try {
      const defaultPosition = await arrowup.supportDatas.findOne({
        where: {
          slug: UserVariables.USER_POSITIONS[0]
        }
      })
      let addUsers = [];
      let emailIds = [];
      let usersData: any = await new Promise((resolve, reject) => {
        csv({
          colParser: {
            "column1": "string",
            "column2": "string",
            "column3": "string",
            "column4": "string",
            "column5": "string",
            "column6": "string",
            "column7": "string",
            "column8": "string",
            "column9": "string",
            "column10": "string"
          }, checkType: true
        })
          .fromString(body)
          .then((csvRow) => {
            let password = null;
            for (let i = 0; i < csvRow.length; i++) {
              csvRow[i]["userEmailId"] = csvRow[i]["userEmailId"].toLowerCase().trim();
              csvRow[i]["userName"] = `${csvRow[i]["userFirstName"]}-${csvRow[i]["userLastName"]}${csvRow[i]["userEmailId"] ? "-" + csvRow[i]["userEmailId"] : ""
                }${csvRow[i]["estIdentifyingKey"] ? "-" + csvRow[i]["estIdentifyingKey"] : ""}`;
              csvRow[i].createdOn = new Date();
              csvRow[i].userDateOfJoining = new Date();
              csvRow[i]['2FAKey'] = TOTP.randomKey();
              password = CommonFunction.generatePassword();
              csvRow[i].password = bcrypt.hashSync(password, 10);
              csvRow[i].userPosition = !isNaN(parseInt(csvRow[i]["userPosition"])) ? csvRow[i]["userPosition"] : defaultPosition.id
              addUsers.push(JSON.parse(JSON.stringify(csvRow[i]))); // save in DB
              csvRow[i].userPassword = password;
              emailIds.push(csvRow[i]["userEmailId"]);
            }
            resolve(csvRow);
            return;
          })
      });
      let existingUsers: any = await arrowup.users.findAll({
        where: {
          userEmailId: {
            [Op.in]: emailIds
          }
        },
        attributes: ['id', 'userEmailId']
      });
      existingUsers = JSON.parse(JSON.stringify(existingUsers));
      // remove existing users from addUsers array. So that only new users are created in DB.
      for (let index = 0; index < existingUsers.length; index++) {
        const element = existingUsers[index];
        let removeDataIndex = addUsers.findIndex((item) => element.userEmailId === item.userEmailId);
        if (removeDataIndex > -1) {
          addUsers.splice(removeDataIndex, 1);
          usersData.splice(removeDataIndex, 1);
        }
      }
      if (addUsers.length) {
        console.log('>>>>>>>>>> \n\n', JSON.stringify(addUsers));
        let users: any = await arrowup.users.bulkCreate(addUsers);
        // Send email to each user.
        if (usersData) {
          const message = Message.EMAIL.SUBJECT;
          for (let i = 0; i < usersData.length; i++) {
            const user = usersData[i];
            const sendData: any = {
              establishment: '',
              estId: user.estIdentifyingKey,
              email: user.userEmailId,
              comment: message,
              name: `${user.userFirstName} ${user.userLastName}`,
              username: user.userName,
              password: user.userPassword,
              link: config.link,
              logo: config.logo,
              sendWelcomeMail: true,
            };
            // Use the email service to send the email
            let success = await ApiCall.makePostCall(config.notificationApi, sendData);
            if (!success) {
              result = {
                response,
                statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
                success,
                error: {
                  details: [{ message: response }],
                },
              };
            }
            await this.establishRelationBetweenCourseAndEmployee(
              users[i].id
            );
          }
        }
      }
      return {
        response: {},
        statusCode: HttpStatusCode.HTTP_CREATED,
        success: true
      };
    } catch (error) {
      console.log(error);
      return;
    }
  }
  // async addUser(ctx: Context, transaction?: any): Promise<any> {
  //   const body: any = ctx.request.body;
  //   const userAnswers = body.answers;
  //   console.log("In function addUser");
  //   let success: boolean = true,
  //     response: string = "",
  //     statusCode: number = 0,
  //     result: any = {};
  //   const role = await arrowup.userRoles.findOne({
  //     where: {
  //       id: body["userRoleId"],
  //     },
  //   });
  //   if (!role) {
  //     response = Message.INVALID_ROLE;
  //     success = false;
  //   }
  //   body["userName"] = `${body["userFirstName"]}-${body["userLastName"]}${body["userEmailId"] ? "-" + body["userEmailId"] : ""
  //     }${body["estIdentifyingKey"] ? "-" + body["estIdentifyingKey"] : ""}`;
  //   const alreadyCreatedUser = await Validations.userAlreadyExistCheck(
  //     body,
  //     null
  //   );
  //   if (alreadyCreatedUser) {
  //     response = Message.USER_ALREADY_EXISTS;
  //     success = false;
  //   }
  //   if (!success) {
  //     result = {
  //       response,
  //       statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
  //       success,
  //       error: {
  //         details: [{ message: response }],
  //       },
  //     };
  //   } else {
  //     body.createdOn = new Date()
  //     body.userDateOfJoining = new Date()
  //     let user: any = await arrowup.users.create(body);
  //     if (user) {
  //       await this.establishRelationBetweenCourseAndEmployee(
  //         user.dataValues.id
  //       );
  //       await CommonFunction.establishRelationBetweenChecklistAndEmployee(
  //         user.dataValues.id
  //       );
  //       if (userAnswers && userAnswers.length) {
  //         userAnswers.forEach((userAnswer: any) => {
  //           userAnswer.answer = userAnswer.answer.toLowerCase();
  //           Object.assign(userAnswer, { userId: user.dataValues.id });
  //           Object.assign(userAnswer, { createdOn: body.createdOn });
  //         });
  //         await arrowup.userAnswers.bulkCreate(
  //           userAnswers
  //         );
  //       }
  //       delete user.dataValues.password;
  //       result = {
  //         response: user.dataValues,
  //         statusCode: HttpStatusCode.HTTP_CREATED,
  //         success: true,
  //       };
  //     } else {
  //       throw new Error(Message.SOMETHING_WENT_WRONG);
  //     }
  //   }
  //   return result;
  // }
  async updateUser(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const id = ctx.params.id;
    const userAnswers = body.answers;
    const deleteAnswers = body.deleteAnswers;
    const field = "Hazardous Training Confirmation";
    console.log(body, '-------------------------------');

    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const isUserExists = await arrowup.users.findOne({ where: { id } });
    if (!isUserExists) {
      response = Message.USER_NOT_FOUND;
      success = false;
      statusCode = HttpStatusCode.HTTP_NO_CONTENT;
    }
    //isDeleted variable is for soft deletion of data
    if (body["isDeleted"] == null || body["isDeleted"] == undefined) {
      //setting username
      body["userName"] = `${body["userFirstName"]}-${body["userLastName"]}${body["userEmailId"] ? "-" + body["userEmailId"] : ""
        }${body["estIdentifyingKey"] ? "-" + body["estIdentifyingKey"] : ""}`;
      const alreadyCreatedUser = await Validations.userAlreadyExistCheck(
        body,
        id
      );
      if (alreadyCreatedUser) {
        response = alreadyCreatedUser;
        success = false;
        statusCode = HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY;
      }
    }
    if (!success) {
      result = {
        response,
        statusCode,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      const summaries: any = {
        userId: id,
        field: field,
        updatedValue: body.textBox ? body.textBox : "",
      }
      await this.addSummaries(summaries)
      const user = await arrowup.users.update(body, {
        where: { id },
        returning: true,
        plain: true,
      });
      if (user) {
        delete user[1].password;
        await this.answerAddOrUpdate(userAnswers, id)
        if (deleteAnswers && deleteAnswers.length) {
          deleteAnswers.forEach(async (answerId: any) => {
            await arrowup.userAnswers.destroy({ where: { id: answerId, userId: id } })
          })
        }
        result = {
          response: user[1],
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        throw new Error(Message.SOMETHING_WENT_WRONG);
      }
    }
    return result;
  }

  async addSummaries(summaries: any) {
    const summaryAlreadyExist = await arrowup.summaries.findOne({ where: summaries })
    if (!summaryAlreadyExist && summaries.updatedValue.length != 0) {
      summaries.createdOn = new Date()
      await arrowup.summaries.create(summaries)
    }
    return true
  }

  async answerAddOrUpdate(answers: any, userId: number) {
    if (answers && answers.length) {
      answers.forEach((userAnswer: any) => {
        userAnswer.answer = userAnswer.answer.toLowerCase();
        Object.assign(userAnswer, { userId: userId });
        Object.assign(userAnswer, { createdOn: new Date() });
      });
      answers.map(async (answer: any) => {
        if (answer.id) {
          const id = answer.id
          delete answer.id
          await arrowup.userAnswers.update(answer, { where: { id } });
        } else {
          await arrowup.userAnswers.create(answer);
        }
      })
    }
    return true
  }
  async getUsers(ctx: Context): Promise<any> {
    const queryParams: any = ctx.query;
    const type = queryParams["type"];
    const query = queryParams["query"];
    const pageNo = queryParams["page_no"];
    const pageSize = queryParams["page_size"];
    const locationSpecific = queryParams["isLocationSpecific"];
    const where: any = {
      isActive: true,
    };
    const innerWhere: any = {};
    if (type) {
      where.userRoleId = type;
    }
    if (locationSpecific == "false") {
      innerWhere.isLocationSpecific = locationSpecific;
    }
    if (query) {
      where[Op.or] = [
        {
          userFirstName: {
            [Op.iLike]: `%${query}%`,
          }
        },
        {
          userEmailId: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          userContactNumber: {
            [Op.iLike]: `%${query}%`,
          },
        }
      ];
    }
    let offset = pageNo,
      limit = pageSize;
    let skip = 0;
    if (offset >= 1) {
      skip = (offset - 1) * limit;
    } else {
      skip = offset;
    }
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0;
    console.log(innerWhere, "innerWhereinnerWhereinnerWhereinnerWhere", where);
    const users = await arrowup.users.findAll({
      where,
      include: {
        model: arrowup.userRoles,
        where: innerWhere,
        required: true,
        // attributes: ["roleName"],
      },
      attributes: { exclude: ["password"] },
      offset: skip,
      limit,
      order: [["id", "ASC"]],
    });
    const total: number = await arrowup.users.count({
      where,
      include: {
        model: arrowup.userRoles,
        where: innerWhere,
        required: true,
        // attributes: ["roleName"],
      },
    });
    return {
      response: users,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
      total,
    };
  }
  async getUser(ctx: Context): Promise<any> {
    console.log("getUser")
    const id = ctx.params.id;
    let includes: Array<any> = [
      {
        model: arrowup.userRoles,
        attributes: ["roleName"],
      },
      {
        model: arrowup.supportDatas,
        required: false,
      },
      {
        model: arrowup.userAnswers,
        required: false,
      },
    ];
    let startDate = moment().startOf("week");
    let endDate = moment().endOf("week");
    includes.push({
      model: arrowup.userCourseTrainings,
      where: {
        trainingType: UserVariables.MICRO_TRAINING_TYPE,
        courseTrainingType: UserVariables.MICRO_COURSE_TYPE,
        // isCompleted: false,
        // scheduledStartDate: {
        //   [Op.and]: {
        //     [Op.gte]: startDate,
        //     [Op.lte]: endDate,
        //   },
        // },
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      required: false,
      attributes: [
        "scheduledStartDate",
        "scheduledEndDate",
        "trainingType",
        "userId",
        "isCompleted",
      ],
    });
    includes.push({
      model: arrowup.userRoles,
      attributes: ["slug", "id"],
    });
    const user = await arrowup.users.findOne({
      where: { id, isActive: true },
      attributes: { exclude: ["password", "isDeleted"] },
      include: includes,
    });
    if (user) {
      let users = JSON.parse(JSON.stringify([user]));
      if (
        user.userRole &&
        user.userRole.slug !== UserVariables.SUPER_ADMIN_ROLE
      ) {
        let userIdIndexMapping = {
          [user.id]: 0,
        };
        users = await EstablishmentService.setTrainingIndicators(
          users,
          user.estIdentifyingKey,
          userIdIndexMapping
        );
      }
      users[0].qrCode = await TwoFAHandler.get2FABase64QR(users[0].userFirstName, users[0]['2FAKey'])
      return {
        response: users[0],
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      throw new Error(Message.SOMETHING_WENT_WRONG);
    }
  }
  async login(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      emailLogin: boolean = true,
      result: any = {};
    const where: any = {};
    emailLogin =
      (UserVariables.EMAIL_LOGIN).indexOf(body["type"]) > -1 ? true : false;
    //for login of admin and users this condition is managed
    // if (emailLogin) {
    //   where.userEmailId = body["user"];
    //   where.estIdentifyingKey = null;
    // } else {
    //   where.userName = body["user"];
    // }
    if (emailLogin) {
      where.userEmailId = body["email"];
      where.estIdentifyingKey = null;
    } else {
      where.userEmailId = body["email"];
    }
    where.isDeleted = false;
    const userData = await arrowup.users.findOne({
      where,
      include: [{
        model: arrowup.userAnswers,
        required: false,
      }, {
        model: arrowup.userRoles,
        required: false,
      }],
    });
    if (!userData) {
      response = Message.USER_NOT_FOUND;
      success = false;
    } else {
      if (!userData.isActive) {
        response = Message.INACTIVE_USER_LOGIN;
        success = false;
      } else {
        if (body['2FACode']) {
          const totp = new TOTP(userData?.['2FAKey']);
          const verfiyAuthentication = totp.verify(body['2FACode'])

          if (!verfiyAuthentication) {
            response = Message.INVALID_2FACODE;
            success = false;
          }
        } else {
          const comparePassword = await CommonFunction.comparePassword(
            body["password"],
            userData.password
          );
          if (!comparePassword) {
            response = Message.LOGIN_PASSWORD_NOT_MATCHED;
            success = false;
          }
        }
      }
    }
    if (!success) {
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      // const tokenWhere: any = {
      //   where: {
      //     userId: userData.id,
      //   },
      // };
      // console.log("tokenWhere", tokenWhere, arrowup.accessToken);
      // const accessTokenCount = await arrowup.accessTokens.count(tokenWhere);
      // console.log("accessTokenCount==", accessTokenCount);
      // //delete already present token
      // if (accessTokenCount > 0) {
      //   await arrowup.accessTokens.destroy(tokenWhere);
      // }
      const tokenData = {
        token: Token.generateNewToken(userData.id),
        userId: userData.id,
      };
      console.log("tokenData--", tokenData);
      const accessTokenData = await arrowup.accessTokens.create(tokenData);
      let user = JSON.parse(JSON.stringify(userData));
      user = await this.userAnswerSet(user)
      user.token = accessTokenData.token;
      delete user.password;
      user.refresh_token = UserVariables.REFRESH_TOKEN;
      console.log(user.userRole);

      if (user.userRole && UserVariables.USER_ROLES_LIKE_SAFETY_LEAD.indexOf(user.userRole.roleName.toLowerCase()) !== -1) {
        user.isSafetyLead = true;
      }
      result = {
        response: user,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    }
    return result;
  }

  async googleLogin(ctx: Context): Promise<CommonResponse> {
    try {
      const { access_token } = ctx.request.body;
      const successData = await ApiCall.getGoogleUserInfo(access_token)
      if (!successData) {
        return {
          response: Message.TOKEN_NOT_FOUND_BY_AXIOS_CALL,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success: false,
          error: {
            details: [{ message: Message.TOKEN_NOT_FOUND_BY_AXIOS_CALL }],
          },
        };
      }

      let userData = await arrowup.users.findOne({
        where: { userEmailId: successData.email, isActive: true },
        include: {
          model: arrowup.userAnswers,
          required: false,
        }
      })
      if (!userData) {
        return {
          response: Message.USER_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.USER_NOT_FOUND }],
          },
        };
      }
      userData = JSON.parse(JSON.stringify(userData));
      userData = await this.userAnswerSet(userData);
      const tokenData = {
        token: Token.generateNewToken(userData.id),
        userId: userData.id,
      };
      if (!tokenData) {
        return {
          response: Message.ERROR_WHILE_GENERATING_TOKEN_FOR_USER,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.ERROR_WHILE_GENERATING_TOKEN_FOR_USER }],
          },
        };
      }
      let isTokenExist = await arrowup.accessTokens.findOne({
        where: { userId: userData.id },
        attributes: ['token']
      })
      if (!isTokenExist) {
        const accessTokenData = await arrowup.accessTokens.create(tokenData);
      } else {
        const accessTokenData = await arrowup.accessTokens.update({ token: tokenData.token }, { where: { userId: userData.id }, });
      }
      userData.token = tokenData.token;
      userData.refresh_token = UserVariables.REFRESH_TOKEN;
      delete userData.password;
      return {
        response: [userData, successData],
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async logout(ctx: Context): Promise<any> {
    const id: number = ctx.state.user.id;
    const token = ctx.state.token
    const tokenWhere: any = {
      where: {
        userId: id,
        token
      },
    };
    console.log(token, "---------token")
    await arrowup.accessTokens.destroy(tokenWhere);
    return {
      response: Message.SUCCESS_LOGOUT,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
  }

  async resetPassword(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const field: string = "passwordChange";
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      id: number = ctx.params.id,
      tokenId: number = ctx.state.user.id,
      result: any = {};
    const role = await arrowup.userRoles.findOne({
      where: {
        id: body["userRoleId"],
      },
    });
    //get saftey lead role est
    const Roleuser: any = await arrowup.users.findOne({
      where: {
        id: tokenId,
      },
    });
    const user: any = await arrowup.users.findOne({
      where: {
        id,
      },
    });
    const roles: any = [
      UserVariables.SUPER_ADMIN_ROLE,
      UserVariables.SAFETY_LEAD_ROLE,
    ];
    const adminRoles: any = await arrowup.userRoles.findAll({
      where: {
        slug: { [Op.in]: roles },
      },
    });
    const safteyLeadRole = _.find(adminRoles, [
      "slug",
      `${UserVariables.SAFETY_LEAD_ROLE}`,
    ]);
    const ids: any = adminRoles.map((val: any) => val.id);
    //received admin or safteylead role
    if (ids.indexOf(Roleuser.userRoleId) > -1) {
      if (
        safteyLeadRole.id == Roleuser.userRoleId &&
        Roleuser.estIdentifyingKey !== user.estIdentifyingKey
      ) {
        response = Message.ROLE_ACCESS;
        success = false;
      }
    } else {
      //check other role
      if (tokenId != id) {
        response = Message.ROLE_ACCESS;
        success = false;
      }
    }
    if (!role) {
      response = Message.INVALID_ROLE;
      success = false;
    }
    if (!success) {
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      await arrowup.users.update(
        {
          password: bcrypt.hashSync(body["password"], 10),
        },
        {
          where: {
            id: ctx.params.id,
          },
        }
      );
      const summaries = {
        userId: ctx.params.id,
        field: field,
        updatedValue: bcrypt.hashSync(body["password"], 10),
      }
      await this.addSummaries(summaries);
      result = {
        response: Message.USER_PASSWORD_UPDATE,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    }
    return result;
  }
  async adminResetPassword(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const field: string = "passwordChange";
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const user = await arrowup.users.findOne({
      where: {
        resetPasswordToken: body.resetPasswordToken,
      },
    });
    if (!user) {
      result = {
        response: Message.RESET_PASSWORD_ISSUE,
        success: false,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        error: {
          details: [{ message: Message.RESET_PASSWORD_ISSUE }],
        },
      };
    } else {
      let duration = moment.duration(
        moment(new Date()).diff(moment(new Date(user.resetPasswordSentAt)))
      );
      let hours = duration.asHours();
      console.log(hours, "hours");
      if (hours > config.linkDuration) {
        result = {
          response: Message.RESET_PASSWORD_ISSUE,
          success: false,
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          error: {
            details: [{ message: Message.RESET_PASSWORD_ISSUE }],
          },
        };
      } else {
        await arrowup.users.update(
          {
            password: bcrypt.hashSync(body["password"], 10),
            resetPasswordToken: null,
            resetPasswordSentAt: null,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
        const summaries = {
          userId: user.id,
          field: field,
          updatedValue: bcrypt.hashSync(body["password"], 10),
        }
        await this.addSummaries(summaries);
        result = {
          response: Message.USER_PASSWORD_UPDATE,
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      }
    }
    return result;
  }
  async changePassword(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const id: number = ctx.state.user.id;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const role = await arrowup.userRoles.findOne({
      where: {
        id: body["userRoleId"],
      },
    });
    if (!role) {
      response = Message.INVALID_ROLE;
      success = false;
    }
    const comparePassword = await CommonFunction.comparePassword(
      body["oldPassword"],
      ctx.state.user.password
    );
    if (!comparePassword) {
      response = Message.OLD_PASSWORD_INVALID;
      success = false;
    }
    if (!success) {
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      await arrowup.users.update(
        {
          password: bcrypt.hashSync(body["password"], 10),
        },
        {
          where: {
            id,
          },
        }
      );
      const summaries = {
        userId: ctx.params.id,
        field: Message.PASSWORD_CHANGE,
        updatedValue: bcrypt.hashSync(body["password"], 10),
      }
      await this.addSummaries(summaries);
      result = {
        response: Message.USER_PASSWORD_UPDATE,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    }
    return result;
  }

  async resetAuth(ctx: Context) {
    const body: any = {};
    const id: number = ctx.params.id;
    body['2FAKey'] = TOTP.randomKey();
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};

    const userData = await arrowup.users.findOne({
      where: {
        id: id,
      },
    });
    if (!userData) {
      response = Message.USER_NOT_FOUND;
      success = false;
    }
    if (!body['2FAKey']) {
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_NO_CONTENT,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      userData.dataValues.qrCode = await TwoFAHandler.get2FABase64QR(userData?.userFirstName, body['2FAKey']);
      result = {
        response: userData.dataValues,
        statusCode: HttpStatusCode.HTTP_CREATED,
        success: true
      }

      const updated2FAKeyData = await arrowup.users.update(body, {
        where: {
          id: id,
        }
      })
      if (!updated2FAKeyData) {
        result = {
          response,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success,
          error: {
            details: [{ message: response }],
          },
        };
      }
    }
    return result;
  }

  async getProfile(ctx: Context): Promise<any> {
    const id: number = ctx.state.user.id;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    let includes: Array<any> = [
      {
        model: arrowup.userRoles,
        attributes: ["roleName", "slug"],
      },
      {
        model: arrowup.supportDatas,
        required: false,
      },
      {
        model: arrowup.userAnswers,
        required: false,
      },
    ];
    let startDate = moment().startOf("week");
    let endDate = moment().endOf("week");
    includes.push({
      model: arrowup.userCourseTrainings,
      where: {
        trainingType: UserVariables.MICRO_TRAINING_TYPE,
        courseTrainingType: UserVariables.MICRO_COURSE_TYPE,
        // isCompleted: false,
        // scheduledStartDate: {
        //   [Op.and]: {
        //     [Op.gte]: startDate,
        //     [Op.lte]: endDate,
        //   },
        // },
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      required: false,
      attributes: [
        "scheduledStartDate",
        "scheduledEndDate",
        "trainingType",
        "userId",
        "isCompleted",
      ],
    });
    includes.push({
      model: arrowup.userRoles,
      attributes: ["slug", "id"],
    });
    const user = await arrowup.users.findOne({
      where: { id, isDeleted: false },
      attributes: { exclude: ["password", "isDeleted"] },
      include: includes,
    });
    if (user) {
      let userDetails = JSON.parse(JSON.stringify(user));
      userDetails = await this.userAnswerSet(userDetails)
      let users = [userDetails];
      if (
        user.userRoles &&
        user.userRoles[0] &&
        user.userRoles[0].slug !== UserVariables.SUPER_ADMIN_ROLE
      ) {
        let userIdIndexMapping = {
          [user.id]: 0,
        };
        users = await EstablishmentService.setTrainingIndicators(
          users,
          user.estIdentifyingKey,
          userIdIndexMapping
        );
      }
      if (user.userRole && UserVariables.USER_ROLES_LIKE_SAFETY_LEAD.indexOf(user.userRole.roleName.toLowerCase()) !== -1) {
        users[0].isSafetyLead = true;
      }
      result = {
        response: users[0],
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.USER_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_NO_CONTENT,
        success,
        error: {
          details: [{ message: Message.USER_NOT_FOUND }],
        },
      };
    }
    return result;
  }

  async userAnswerSet(user: any) {
    const userAnswer = await arrowup.userAnswers.findOne({ where: { userId: user.id } })
    if (userAnswer) {
      user.isUserAnswerSet = true
    } else {
      user.isUserAnswerSet = false
    }
    return user;
  }

  async getPositions(ctx: Context): Promise<any> {
    const allRoles = UserVariables.USER_POSITIONS;
    return {
      response: allRoles,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
  }
  async sendFeedback(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    let establishment: any = await arrowup.establishments.findOne({
      where: { estIdentifyingKey: body["estId"] },
    });
    if (establishment) {
      if (establishment.estFeedbackEmailId) {
        const sendData: any = {
          establishment: establishment.estName,
          email: establishment.estFeedbackEmailId,
          comment: body["feedback"],
          estId: body["estId"],
        };
        await ApiCall.makePostCall(config.notificationApi, sendData);
        result = {
          response: Message.FEEDBACK_SENT,
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        result = {
          response: Message.EMAIL_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_FORBIDDEN,
          success: false,
          error: {
            details: [{ message: Message.EMAIL_NOT_FOUND }],
          },
        };
      }
      return result;
    } else {
      result = {
        response: Message.EST_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_FORBIDDEN,
        success: false,
        error: {
          details: [{ message: Message.EST_NOT_FOUND }],
        },
      };
    }
    return result;
  }
  async getUserCourses(ctx: Context): Promise<any> {
    const id = ctx.params.id;
    const userId = ctx.state.user.id;
    const user: any = await arrowup.users.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: arrowup.userRoles,
        },
      ],
    });
    console.log(user.userRole.slug, "--useruseruseruser");
    const where: any = { isActive: true };
    if (user.userRole.slug == UserVariables.SUPER_ADMIN_ROLE) {
      where.userId = id;
    } else {
      where.userId = userId;
    }
    const startDate = moment().startOf("month");
    const endDate = moment().startOf("month").endOf("month");
    console.log('start date -->', startDate, 'end date--->', endDate);
    const whereTrainingBits: any = JSON.parse(JSON.stringify(where));
    whereTrainingBits[Op.or] = [
      {
        scheduledStartDate: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      },
      {
        scheduledEndDate: {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      },
    ];
    whereTrainingBits.trainingType = UserVariables.MICRO_TRAINING_TYPE;
    whereTrainingBits.courseTrainingType = UserVariables.MICRO_COURSE_TYPE;
    const trainingBites = await arrowup.userCourseTrainings.findAll({
      where: whereTrainingBits,
      include: [
        {
          model: arrowup.trainings,
          include: [
            {
              model: arrowup.trainingLanguages,
            },
          ],
        },
      ],
      order: [["trainingSequence", "ASC"]],
    });
    const whereExtras: any = JSON.parse(JSON.stringify(where));
    whereExtras.trainingType = UserVariables.MICRO_TRAINING_TYPE;
    whereExtras.courseTrainingType = UserVariables.MICRO_EXTRA_TYPE;
    const extras = await arrowup.userCourseTrainings.findAll({
      where: whereExtras,
      include: [
        {
          model: arrowup.trainings,
          include: [
            {
              model: arrowup.trainingLanguages,
            },
          ],
        },
      ],
      order: [["trainingSequence", "ASC"]],
    });
    const wherefoundationTrainings: any = JSON.parse(JSON.stringify(where));
    wherefoundationTrainings.trainingType =
      UserVariables.ON_BOARDING_TRAINING_TYPE;
    const foundationTrainings = await arrowup.userCourseTrainings.findAll({
      where: wherefoundationTrainings,
      include: [
        {
          model: arrowup.trainings,
          include: [
            {
              model: arrowup.trainingLanguages,
            },
          ],
        },
      ],
      order: [["trainingSequence", "ASC"]],
    });
    return {
      response: { trainingBites, extras, foundationTrainings },
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
  }
  async getUserCourseDetails(ctx: Context): Promise<any> {
    const id = ctx.params.id;
    const training = await arrowup.userCourseTrainings.findOne({
      where: {
        id,
      },
      include: [
        {
          model: arrowup.trainings,
          include: [
            {
              model: arrowup.trainingLanguages,
            },
          ],
        },
      ],
      order: [["trainingSequence", "ASC"]],
    });
    return {
      response: training,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
  }
  async getUserChecklists(ctx: Context): Promise<any> {
    const id = ctx.params.id ? ctx.params.id : ctx.state.user.id;
    const queryParams: any = ctx.query;
    const type = queryParams["type"];
    const checklistId: number = Number(queryParams["checklistId"]);
    let response: any = {};
    const startDate = moment().startOf("month");
    const endDate = moment().startOf("month").endOf("month");
    console.log(endDate, "start-", startDate);
    const where: any = {
      userId: id,
      isActive: true,
      [Op.or]: [
        {
          scheduledStartDate: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
        {
          scheduledEndDate: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
      ]
    };
    if (checklistId) {
      where.checklistId = checklistId;
    }
    const serachWhere: any = JSON.parse(JSON.stringify(where));
    if (type) {
      serachWhere.type = type;
    }
    const checklists = await arrowup.userChecklistInfos.findAll({
      where: serachWhere,
      include: [
        {
          model: arrowup.schedules,
          include: [
            {
              model: arrowup.checklistSchedules,
            },
          ],
        },
        {
          model: arrowup.checklists,
          include: [
            {
              model: arrowup.checklistTasks,
            },
          ],
        },
        {
          model: arrowup.tasks,
          include: [
            {
              model: arrowup.supportDatas,
            },
          ],
        },
      ],
      order: [["sequence", "ASC"]],
    });
    const completedWhere: any = JSON.parse(JSON.stringify(where));
    const totalTasks = await arrowup.userChecklistInfos.count({
      where,
    });
    completedWhere.isCompleted = true;
    const totalTasksCompleted = await arrowup.userChecklistInfos.count({
      where: completedWhere,
    });
    let result = JSON.parse(JSON.stringify(checklists));
    result.forEach((item) => {
      item.checklistResponse = item.checklistResponse
        ? JSON.parse(item.checklistResponse)
        : {};
    });
    response = {
      result,
      totalTasks,
      totalTasksCompleted,
      scheduledEndDate: null
    };
    if (checklistId) {
      response.scheduledEndDate = result[0] ? result[0].scheduledEndDate : null;
    }
    return {
      response: response,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
  }
  async updateUserTraining(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const id = ctx.params.id;
    const userId: number = ctx.state.user ? ctx.state.user.id : null;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const isUserExists = await arrowup.userCourseTrainings.findOne({
      where: { id },
    });
    console.log(body.completedOn && new Date(body.completedOn) > new Date(isUserExists.scheduledEndDate), new Date(body.completedOn), ">", new Date(isUserExists.scheduledEndDate))
    if (!isUserExists) {
      result = {
        response: Message.USER_TRAINING_NOT_FOUND,
        success: false,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        error: {
          details: [{ message: Message.USER_TRAINING_NOT_FOUND }],
        },
      };
    } else {
      body.modifiedBy = userId;
      body.updatedOn = new Date();
      if (body.completedOn && new Date(body.completedOn) > new Date(isUserExists.scheduledEndDate)) {
        body.completedOn = null
        body.isCompleted = false
      }
      const user = await arrowup.userCourseTrainings.update(body, {
        where: { id },
        returning: true,
        plain: true,
      });
      if (user) {
        delete user[1].password;
        result = {
          response: user[1],
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        throw new Error(Message.SOMETHING_WENT_WRONG);
      }
    }
    return result;
  }
  async updateUserChecklist(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const id = ctx.params.id;
    const deleteLinks: any = body['deleteLinks']
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};

    console.log(body,'-bodybodybodybodybodybodybody');
    

    const isUserExists = await arrowup.userChecklistInfos.findOne({
      where: { id },
    });
    if (!isUserExists) {
      result = {
        response: Message.USER_CHECKLIST_NOT_FOUND,
        success: false,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        error: {
          details: [{ message: Message.USER_CHECKLIST_NOT_FOUND }],
        },
      };
    } else {
      body.updatedOn = new Date();
      if (body.checklistResponse) {
        body.checklistResponse = JSON.stringify(body.checklistResponse);
      }
      console.log(body.completedOn,'----------------completedOn-----------------');
      console.log(isUserExists.scheduledEndDate,'------------------scheduledEndDate---------');
      
      if (body.completedOn && new Date(body.completedOn) > new Date(isUserExists.scheduledEndDate)) {
        console.log('------------------------------------------------------');
        
        body.completedOn = null
        body.isCompleted = false
      }
      const user = await arrowup.userChecklistInfos.update(body, {
        where: { id },
        returning: true,
        plain: true,
      });
      if (user) {
        if (deleteLinks && deleteLinks.length) {
          const objects = []
          deleteLinks.forEach(async (link: string) => {
            console.log("deleting---", link)
            objects.push({ Key: link })
          })
          console.log(objects, "deleted object")
          await imageHandler.deleteFileOnS3(objects)
        }
        //absent will be update on checklist so all
        if (body.markAbsent || !body.markAbsent) {
          const newBody: any = {
            markAbsent: body.markAbsent
          }
          await arrowup.userChecklistInfos.update(newBody, {
            where: {
              checklistId: user[1].checklistId,
              userId: user[1].userId
            }
          });
        }
        result = {
          response: user[1],
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        throw new Error(Message.SOMETHING_WENT_WRONG);
      }
    }
    return result;
  }
  async forgotPassword(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const queryParams: any = ctx.query;
    const type = queryParams["type"];
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const isUserExists: any = await arrowup.users.findOne({
      where: {
        userEmailId: body.email.trim(),
      },
    });
    if (!isUserExists) {
      result = {
        response: Message.USER_NOT_FOUND,
        success: false,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        error: {
          details: [{ message: Message.USER_NOT_FOUND }],
        },
      };
    } else {
      const token: string = await CommonFunction.generateConfimationToken(20);
      const user: any = await arrowup.users.update(
        {
          resetPasswordToken: token,
          resetPasswordSentAt: new Date(),
        },
        {
          where: { id: isUserExists.id },
        }
      );
      if (user) {
        const portal = type == UserVariables.SUPER_ADMIN_ROLE ? config.siteLink : config.brokerLink
        const sendData: any = {
          email: isUserExists.userEmailId,
          link: `${portal}/auth/reset/${token}`,
        };
        console.log(sendData, "===============")
        await ApiCall.makePostCall(
          `${config.notificationApi}/forgot`,
          sendData
        );
        result = {
          response: isUserExists,
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        throw new Error(Message.SOMETHING_WENT_WRONG);
      }
    }
    return result;
  }
  async getChecklistsOfUser(ctx: any): Promise<any> {
    const userId: number = ctx.params.userId
      ? ctx.params.userId
      : ctx.state.user.id;
    let result: any = {};
    let userDetails: any = await arrowup.users.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "estIdentifyingKey"],
    });
    const startDate = moment().startOf("month");
    const endDate = moment().startOf("month").endOf("month");
    console.log(endDate, "start-", startDate);
    let userChecklistInfos: any = await arrowup.userChecklistInfos.findAll({
      where: {
        userId: userId,
        estId: userDetails.estIdentifyingKey,
        isActive: true,
        // [Op.or]: [
        //   {
        //     scheduledStartDate: {
        //       [Op.and]: {
        //         [Op.gte]: startDate,
        //         [Op.lte]: endDate,
        //       },
        //     },
        //   },
        //   {
        //     scheduledEndDate: {
        //       [Op.and]: {
        //         [Op.gte]: startDate,
        //         [Op.lte]: endDate,
        //       },
        //     },
        //   },
        // ]
      },
      include: [
        {
          model: arrowup.checklists,
          attributes: ['thumbnailUrl', 'checklistName']
        },
      ],
      order: [["sequence", "ASC"]],
      attributes: ['checklistId', 'scheduledEndDate', 'isCompleted', 'markAbsent',
        'completedOn', 'id']
    });
    userChecklistInfos = JSON.parse(JSON.stringify(userChecklistInfos));
    let checklists: Array<any> = EstablishmentService.parseChecklist(userChecklistInfos);
    result = {
      checklists
    };
    return CommonFunction.serviceResponse(result);
  }
  /**
   * Helpers
   */
  async establishRelationBetweenCourseAndEmployee(userId: number) {
    // get establishment ID from users table for userId
    const user: any = await arrowup.users.findOne({
      where: {
        id: userId,
        isActive: true,
      },
    });
    if (user && user.estIdentifyingKey) {
      console.log(user.estIdentifyingKey, "-user.estIdentifyingKey");
      //find parent id of est
      const estData: any = await arrowup.establishments.findOne({
        where: {
          estIdentifyingKey: user.estIdentifyingKey,
        },
      });
      console.log(estData.estParentId, "--------------estData");
      const where = {
        role: user.userRoleId,
        [Op.or]: [
          {
            estId: user.estIdentifyingKey,
          },
          {
            estId: null,
            parentId: estData.estParentId,
          },
        ],
      };
      // get data from EstablishmentCourseInfo table for user and its est
      const establishmentCourseInfo: any =
        await arrowup.establishmentCourseInfos.findAll({
          where,
        });
      console.log("establishmentCourseInfo", establishmentCourseInfo);
      await this.addUserTrainingData(establishmentCourseInfo, userId, user);
    } else {
      console.log("##### user not found in DB #####");
    }
    return true;
  }
  async addUserTrainingData(
    establishmentCourseInfo: any,
    userId: number,
    user: any
  ) {
    if (establishmentCourseInfo && establishmentCourseInfo.length) {
      // get training id for courses
      const courseIds = establishmentCourseInfo.map((ele: any) => ele.courseId);
      console.log("courseIds-", courseIds);
      const courseTrainings = await arrowup.courseTrainings.findAll({
        where: {
          courseId: {
            [Op.in]: courseIds,
          },
          isDeleted: false,
        },
        include: [
          {
            model: arrowup.trainings,
            include: [
              {
                model: arrowup.supportDatas,
              },
            ],
          },
        ],
      });
      const courseTraining = await arrowup.courseTrainings.findOne({})
      const trainingData = await arrowup.trainings.findOne({
        where: {
          trainingId: courseTraining.trainingId,
        }
      })
      const userCourseTrainings: Array<number> = courseTrainings.map(
        (ele: any) => {
          ele = JSON.parse(JSON.stringify(ele));
          console.log(ele.isPriorityTraining, '------------------------------------------------------ele');
          let endDate: any = ele.endDate, startDate: any = ele.startDate
          if (
            ele.training.supportData.slug ==
            UserVariables.ON_BOARDING_TRAINING_TYPE
          ) {
            if (ele.dueBeforeDays) {
              endDate = moment(new Date(), "DD-MM-YYYY").add(
                ele.dueBeforeDays,
                "days"
              );
              startDate = moment()
            }
          }
          const start = moment(startDate), end = moment(endDate)
          let userCourseTraining = {
            userId: userId,
            estId: user.estIdentifyingKey,
            courseId: ele.courseId,
            trainingId: ele.trainingId,
            scheduledStartDate: start.startOf('day').toString(),
            scheduledEndDate: end.endOf('day').toString(),
            isCompleted: false,
            startedOn: null,
            completedOn: null,
            lastAccessedOn: null,
            durationCompleted: null,
            trainingmonth: ele.endDate
              ? moment(ele.endDate).format("MMMM")
              : null,
            updatedOn: null,
            isActive: true,
            trainingStatus: "NOT_STARTED",
            modifiedBy: userId,
            courseTrainingType: ele.type,
            trainingType: ele.training.supportData.slug,
            dueBeforeDays: ele.dueBeforeDays,
            trainingSequence: ele.trainingSequence,
            isPriorityTraining: ele.isPriorityTraining,
          };
          return userCourseTraining;
        }
      );
      // add data in User_Course_Training table
      let success = await arrowup.userCourseTrainings.bulkCreate(userCourseTrainings);
      console.log("success", success);
      if (success) {
        const message = Message.EMAIL.TRAINING;
        const sendData: any = {
          establishment: '',
          estId: user.estIdentifyingKey,
          email: user.userEmailId,
          comment: message,
          name: `${user.userFirstName} ${user.userLastName}`,
          username: user.userName,
          password: user.password,
          link: config.link,
          logo: config.logo,
          sendTrainingMail: true,
          trainingName: trainingData.trainingName,
          dueBeforeDays: courseTraining.dueBeforeDays,
        };
        let success = await ApiCall.makePostCall(config.notificationApi, sendData);
      }
    } else {
      console.log("##### Courses not found in DB for establishment #####");
    }
    return true;
  }

  async getUsersByCourseId(ctx: Context): Promise<CommonResponse> {
    try {
      const estId: number = ctx?.params?.estId;
      const courseIds = ctx.request['courseIds'];
      const whereCondition: any = { isActive: true };
      const query: {
        courseId?: number;
        trainingId?: number;
        startDate?: string;
        endDate?: string;
      } = ctx.request.query;
      if (estId) {
        whereCondition.estId = estId;
      }
      if (query.courseId) {
        whereCondition.courseId = query.courseId;
      }
      if (query.trainingId) {
        whereCondition.trainingId = query.trainingId;
      }
      if (query.startDate && query.endDate) {
        whereCondition.scheduledStartDate = { [Op.gte]: moment(parseInt(query.startDate)) };
        whereCondition.scheduledEndDate = { [Op.lte]: moment(parseInt(query.endDate)) };
      }
      if (courseIds && courseIds.length) {
        whereCondition.courseId = {
          [Op.in]: courseIds
        };
      }
      console.log('whereCondition === ', whereCondition);
      let userCourseTrainingData = await arrowup.userCourseTrainings.findAll({
        where: whereCondition,
        include: [
          {
            model: arrowup.users,
            attributes: ['id', 'userFirstName', 'userLastName', 'userEmailId', 'userContactNumber', 'userDateOfJoining'],
          },
          {
            model: arrowup.establishments,
            attributes: ['estParentId'],
          }
        ],
        order: [['id', 'ASC']],
      });

      if (!userCourseTrainingData) {
        return {
          response: Message.USER_ESTABLISHMENT_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.USER_ESTABLISHMENT_NOT_FOUND }],
          },
        };
      }
      return {
        response: userCourseTrainingData,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getSummary(ctx: Context) {
    const id: number = ctx.params.id;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const summaries = await arrowup.summaries.findAll({ where: { userId: id } });
    if (summaries) {
      result = {
        response: summaries,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.SUMMARY_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: Message.SUMMARY_NOT_FOUND }],
        },
      };
    }
    return result
  }

  async getQuestions(ctx: Context) {
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const questions = await arrowup.securityQuestions.findAll({ where: { isActive: true } });
    if (questions) {
      result = {
        response: questions,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.QUESTIONS_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: Message.QUESTIONS_NOT_FOUND }],
        },
      };
    }
    return result
  }

  async getQuestionsOnBehalfOfEmail(ctx: Context) {
    const query: {
      email?: string;
    } = ctx.request.query;
    let success: boolean = true;
    let response: string = "";
    let statusCode: number = 0;
    let result: any = {};

    try {
      const userData = await arrowup.users.findOne({
        attributes: ['id', 'userRoleId', 'estIdentifyingKey'],
        where: {
          userEmailId: query.email
        }
      });

      if (!userData) {
        result = {
          response: Message.USER_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success,
          error: {
            details: [{ message: Message.USER_NOT_FOUND }],
          },
        };
        return result;
      }

      const userAnswersData = await arrowup.userAnswers.findOne({
        attributes: ['questionId'],
        where: {
          userId: userData.id
        }
      });

      if (!userAnswersData) {
        result = {
          response: Message.INVALID_ID,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success,
          error: {
            details: [{ message: Message.INVALID_ID }],
          },
        };
        return result;
      }

      const userQuestion = await arrowup.securityQuestions.findOne({
        attributes: ['id', 'question'],
        where: {
          id: userAnswersData.questionId
        }
      });

      if (!userQuestion) {
        result = {
          response: Message.QUESTIONS_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success,
          error: {
            details: [{ message: Message.QUESTIONS_NOT_FOUND }],
          },
        };
        return result;
      }

      result = {
        response: [userData, userQuestion],
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };

      return result;
    } catch (error) {
      // Handle any unexpected errors
      console.error(error);
      result = {
        response: Message.SOMETHING_WENT_WRONG,
        statusCode: HttpStatusCode.HTTP_INTERNAL_SERVER_ERROR,
        success: false,
        error: {
          details: [{ message: Message.SOMETHING_WENT_WRONG }],
        },
      };
      return result;
    }
  }


  async forgotUserPassword(ctx: Context) {
    const id: number = ctx.params.userId;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const answers = await arrowup.userAnswers.findAll({
      where: { userId: id }, include: [
        {
          model: arrowup.securityQuestions,
        },
      ]
    });
    if (answers) {
      result = {
        response: answers,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.QUESTIONS_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: Message.QUESTIONS_NOT_FOUND }],
        },
      };
    }
    return result
  }
  async addUserEstablishment(ctx: Context) {
    const body: any = ctx.request.body;
    const userEstablishments = body.userEstablishment
    const establishment = [];
    const date = new Date();
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any,
    } = {
      success: true,
      response: "",
      statusCode: 0
    };

    for (const userEstablishment of userEstablishments) {
      for (const establishmentId of userEstablishment.establishmentIds) {
        const where: any = {
          userId: userEstablishment.userId,
          estId: establishmentId
        }
        const userEstablishmentExist = await arrowup.userEstablishments.findOne({ where })
        if (!userEstablishmentExist) {
          establishment.push({ "userId": userEstablishment.userId, "estId": establishmentId, "createdOn": date })
        }
      }
    }
    const createUserEstablishment = await arrowup.userEstablishments.bulkCreate(establishment);
    if (createUserEstablishment) {
      result = {
        response: createUserEstablishment,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      throw new Error(Message.SOMETHING_WENT_WRONG);
    }
    return result
  }

  async checkUserAnswer(ctx: Context) {
    const id: number = ctx.params.userId;
    const body: any = ctx.request.body;
    const answer = body.answer.toLowerCase();
    const questionId: number = body.questionId;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const answerResult = await arrowup.userAnswers.findOne({
      where: { userId: id, questionId: questionId }, include: [
        {
          model: arrowup.securityQuestions,
        },
      ]
    });
    if (answerResult) {
      let userAnswer = JSON.parse(JSON.stringify(answerResult));
      if (answer == userAnswer.answer) {
        const userToken = Token.generateNewToken(id.toString())
        await arrowup.accessTokens.update({ token: userToken }, { where: { userId: id }, });
        result = {
          response: {
            answerResult,
            userToken
          },
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        result = {
          response: Message.INCORRECT_RESPONSE,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success: false,
          error: {
            details: [{ message: Message.INCORRECT_RESPONSE }],
          },
        };
      }
    } else {
      result = {
        response: Message.QUESTIONS_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success: false,
        error: {
          details: [{ message: Message.QUESTIONS_NOT_FOUND }],
        },
      };
    }
    return result
  }

  async getUserEstablishment(ctx: Context) {
    const queryParams: any = ctx.query;
    const userId = queryParams["user_id"];
    const establishmentId = queryParams["establishment_id"];
    const pageNo = queryParams["page_no"];
    const pageSize = queryParams["page_size"];
    const where: any = {}
    let offset = pageNo,
      limit = pageSize;
    let skip = 0;

    if (offset >= 1) {
      skip = (offset - 1) * limit;
    } else {
      skip = offset;
    }

    if (userId && establishmentId) {
      where.userId = userId,
        where.estId = establishmentId
    } else if (userId) {
      where.userId = userId
    } else if (establishmentId) {
      where.estId = establishmentId
    }

    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any
    } = {
      success: true,
      response: "",
      statusCode: 0
    };
    const userEstablishments = await arrowup.userEstablishments.findAll({
      where,
      include: [
        {
          model: arrowup.users,
          required: false,
        },
        {
          model: arrowup.establishments,
          required: false,
          include: [{
            model: arrowup.parentEstablishments,
            attributes: ['estParentName'],
            required: false,
          }]
        }
      ],
      offset: skip,
      limit,
      order: [["id", "ASC"]],
    });
    if (userEstablishments) {
      const total: number = await arrowup.userEstablishments.count({ where })
      result = {
        response: {
          userEstablishments,
          total
        },
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.USER_ESTABLISHMENT_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_BAD_REQUEST,
        success: false,
        error: {
          details: [{ message: Message.USER_ESTABLISHMENT_NOT_FOUND }],
        },
      };
    }
    return result
  }


  async deleteUserEstablishment(ctx: Context) {
    const id: number = ctx.params.id;
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any
    } = {
      success: true,
      response: "",
      statusCode: 0
    };
    const userEstablishment = await arrowup.userEstablishments.destroy({ where: { id: id } })
    if (userEstablishment) {
      result = {
        response: Message.DELETE_SUCCESS,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.USER_ESTABLISHMENT_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_BAD_REQUEST,
        success: false,
        error: {
          details: [{ message: Message.USER_ESTABLISHMENT_NOT_FOUND }],
        },
      };
    }
    return result
  }

  async addAnswer(ctx: Context) {
    const id: number = ctx.params.userId;
    const body: any = ctx.request.body;
    const answers = body.answers;
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any
    } = {
      success: true,
      response: "",
      statusCode: 0
    };
    let alreadyAddAnswer: any;
    // check if answer already exist for same user in question
    for (const answer of answers) {
      alreadyAddAnswer = await arrowup.userAnswers.findOne({ where: { userId: id, questionId: answer.questionId } })
      if (alreadyAddAnswer)
        break
    }
    if (alreadyAddAnswer) {
      result = {
        response: Message.ANSWER_ALREADY_EXIST,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success: true,
      }
    } else {
      const answer = await this.answerAddOrUpdate(answers, id)
      if (answer) {
        result = {
          response: Message.ANSWER_ADDED,
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        result = {
          response: Message.SOMETHING_WENT_WRONG,
          statusCode: HttpStatusCode.HTTP_BAD_REQUEST,
          success: false,
          error: {
            details: [{ message: Message.USER_ESTABLISHMENT_NOT_FOUND }],
          },
        };
      }
    }
    return result
  }

  async addUserEstablishmentImages(ctx: Context) {
    const body: any = ctx.request.body;
    const date = new Date();
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any,
    } = {
      success: true,
      response: "",
      statusCode: 0
    };
    const createUserEstablishmentImage = await arrowup.establishmentImages.create({
      estId: body.estId,
      imageKey: body.imageKey,
      imageUrl: body.imageUrl,
    })

    if (createUserEstablishmentImage) {
      result = {
        response: createUserEstablishmentImage,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      throw new Error(Message.SOMETHING_WENT_WRONG);
    }
    return result
  }

  async getUserEstablishmentImages(ctx: Context) {
    // const userId = ctx.params.userId; 
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any,
    } = {
      success: true,
      response: "",
      statusCode: 0
    };

    try {
      const page: any = ctx?.query?.page || 1;
      const limit: any = ctx?.query?.limit || 10;
      const offset: any = (page - 1) * limit;

      const establishmentImages = await arrowup.establishmentImages.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      result = {
        response: establishmentImages,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } catch (error) {
      result = {
        success: false,
        response: "",
        statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
        error: error.message,
      };
    }

    return result;
  }

  async updateUserEstablishmentImages(ctx: Context) {
    const body = ctx.request.body;
    const id: number = ctx.params.id;
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any
    } = {
      success: true,
      response: "",
      statusCode: 0
    };

    const userEstablishment = await arrowup.establishmentImages.update(body, {
      where: { id: id }
    })

    if (userEstablishment) {
      result = {
        response: Message.UPDATE_SUCCESS,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.USER_ESTABLISHMENT_IMAGE_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_BAD_REQUEST,
        success: false,
        error: {
          details: [{ message: Message.USER_ESTABLISHMENT_IMAGE_NOT_FOUND }],
        },
      };
    }
    return result;
  }

  async deleteUserEstablishmentImages(ctx: Context) {
    const id: number = ctx.params.id;
    let result: {
      success: boolean,
      response: any,
      statusCode: number,
      error?: any
    } = {
      success: true,
      response: "",
      statusCode: 0
    };
    const userEstablishment = await arrowup.establishmentImages.destroy({ where: { id: id } })
    if (userEstablishment) {
      result = {
        response: Message.DELETE_SUCCESS,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.USER_ESTABLISHMENT_IMAGE_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_BAD_REQUEST,
        success: false,
        error: {
          details: [{ message: Message.USER_ESTABLISHMENT_NOT_FOUND }],
        },
      };
    }
    return result;
  }

  async downloadUserCsv(ctx: Context): Promise<CommonResponse> {
    const estId: number = ctx?.params?.estId;
    const query: {
      courseId?: number;
      trainingId?: number;
      trainingStatus?: string;
    } = ctx.request.query;
    const body = ctx.request.body;
    try {
      const courseId = query.courseId || body?.establishmentCourseInfosData?.courseId;
      const whereCondition: any = {};
      if (courseId) {
        const courseExists = await arrowup.courses.findOne({
          where: {
            id: courseId,
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
        whereCondition.courseId = courseId;
      }
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
        whereCondition.trainingId = query.trainingId;
      }

      if (query.trainingStatus) {
        const trainingStatusParsed = JSON.parse(query.trainingStatus);
        const userCourseTrainingStatusExist = await arrowup.userCourseTrainings.findAll({
          where: {
            trainingStatus: query.trainingStatus,
          }
        })
        if (!userCourseTrainingStatusExist) {
          // Handle the case where the trining status does not exist
          return {
            response: Message.INVALID_TRAINING_STATUS,
            statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
            success: false,
            error: {
              details: [{ message: Message.INVALID_TRAINING_STATUS }],
            },
          };
        }
        whereCondition.trainingStatus = { [Op.in]: trainingStatusParsed };
      }

      let userCourseTrainingData = await arrowup.userCourseTrainings.findAll({
        where: whereCondition,
        order: [['id', 'ASC']],
      });

      if (!userCourseTrainingData) {
        return {
          response: Message.USER_ESTABLISHMENT_NOT_FOUND,
          statusCode: HttpStatusCode.HTTP_REQUESTED_RESOURCE_NOT_FOUND,
          success: false,
          error: {
            details: [{ message: Message.USER_ESTABLISHMENT_NOT_FOUND }],
          },
        };
      }
      userCourseTrainingData = JSON.parse(JSON.stringify(userCourseTrainingData));
      const userIds = userCourseTrainingData.map((ele) => ele.userId);
      let usersData = await arrowup.users.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          }
        },
        attributes: ['userRoleId', 'estIdentifyingKey', 'userFirstName', 'userLastName', 'userEmailId', 'userContactNumber', 'countryIsdCode'],
      });
      usersData = JSON.parse(JSON.stringify(usersData));
      const csvBuffer = await fastcsv.writeToBuffer(usersData, { headers: true })
      return {
        response: csvBuffer,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async trainingDurationStatistics(ctx: Context): Promise<CommonResponse> {
    try {
      let result: Result = { success: true, response: "", statusCode: 200 };
      const query: { userId?: number; startDate?: string; endDate?: string } = ctx.request.query;
      const whereCondition: any = { isActive: true };
      if (query.startDate && query.endDate) {
        whereCondition.scheduledStartDate = { [Op.gte]: parseInt(query.startDate) };
        whereCondition.scheduledEndDate = { [Op.lte]: parseInt(query.endDate) };
      }
      if (query.userId) {
        result.response = await this.getTrainingStatisticsByUserId(query.userId, whereCondition);
        // whereCondition.userId = query.userId;
        // const training = await arrowup.userCourseTrainings.findAll({
        //   where: whereCondition,
        //   include: [
        //     {
        //       model: arrowup.trainings,
        //       include: [
        //         {
        //           model: arrowup.trainingLanguages,
        //           attributes: ['duration'],
        //         },
        //       ],
        //       attributes: ['trainingId']
        //     },
        //     {
        //       model: arrowup.users,
        //       attributes: ['id', 'userFirstName', 'userLastName', 'userEmailId', 'userContactNumber', 'userDateOfJoining'],
        //     },
        //   ],
        //   order: [["trainingSequence", "ASC"]],
        // });
        // let totalDuration = 0;
        // training.forEach((item) => {
        //   const trainingLanguages = item?.training?.trainingLanguages || [];
        //   totalDuration += CommonFunction.trainingDurationCount(trainingLanguages);
        // });
        // result.response = { totalDurationOfUser: totalDuration, completedCount: completedCount, inProgressCount: inProgressCount, notStartedCount: notStartedCount };
      } else {
        let completedCount = await arrowup.userCourseTrainings.count({
          col: 'trainingId',
          distinct: true,
          where: { trainingStatus: "COMPLETED", ...whereCondition },
        });
        let inProgressCount = await arrowup.userCourseTrainings.count({
          col: 'trainingId',
          distinct: true,
          where: { trainingStatus: "IN_PROGRESS", ...whereCondition },
        });
        let notStartedCount = await arrowup.userCourseTrainings.count({
          col: 'trainingId',
          distinct: true,
          where: { trainingStatus: "NOT_STARTED", ...whereCondition },
        });
        const training = await arrowup.userCourseTrainings.findAll({
          where: whereCondition,
          include: [
            {
              model: arrowup.trainings,
              include: [
                {
                  model: arrowup.trainingLanguages,
                  attributes: ['duration'],
                },
              ],
              attributes: ['trainingId']
            },
            {
              model: arrowup.users,
              attributes: ['id', 'userFirstName', 'userLastName', 'userEmailId', 'userContactNumber', 'userDateOfJoining'],
            },
          ],
          order: [["trainingSequence", "ASC"]],
        });
        let totalDuration = 0;
        training.forEach((item) => {
          const trainingLanguages = item?.training?.trainingLanguages || [];
          totalDuration += CommonFunction.trainingDurationCount(trainingLanguages);
        });
        let formattedTotalDuration = CommonFunction.convertMinsToHrsMins(totalDuration);
        result.response = { totalDurationOfAllUser: formattedTotalDuration, completedCount: completedCount, inProgressCount: inProgressCount, notStartedCount: notStartedCount };
      }
      return result;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getTrainingStatisticsByUserId(userId, whereCondition) {
    let result: any = {};
    whereCondition.userId = userId;
    let completedCount = await arrowup.userCourseTrainings.count({
      col: 'trainingId',
      // distinct: true,
      where: { trainingStatus: "COMPLETED", ...whereCondition },
    });
    let inProgressCount = await arrowup.userCourseTrainings.count({
      col: 'trainingId',
      // distinct: true,
      where: { trainingStatus: "IN_PROGRESS", ...whereCondition },
    });
    let notStartedCount = await arrowup.userCourseTrainings.count({
      col: 'trainingId',
      // distinct: true,
      where: { trainingStatus: "NOT_STARTED", ...whereCondition },
    });
    const training = await arrowup.userCourseTrainings.findAll({
      where: whereCondition,
      include: [
        {
          model: arrowup.trainings,
          include: [
            {
              model: arrowup.trainingLanguages,
              attributes: ['duration'],
            },
          ],
          attributes: ['trainingId']
        },
        {
          model: arrowup.users,
          attributes: ['id', 'userFirstName', 'userLastName', 'userEmailId', 'userContactNumber', 'userDateOfJoining'],
        },
      ],
      order: [["trainingSequence", "ASC"]],
    });
    let totalDuration = 0;
    training.forEach((item) => {
      if (item && item.isCompleted) {
        const trainingLanguages = item?.training?.trainingLanguages || [];
        totalDuration += CommonFunction.trainingDurationCount(trainingLanguages);
      }
    });
    let formattedTotalDuration = CommonFunction.convertMinsToHrsMins(totalDuration);
    result = { totalDurationOfUser: formattedTotalDuration, completedCount: completedCount, inProgressCount: inProgressCount, notStartedCount: notStartedCount };
    return result;
  }

  async userTrainingStatistics(ctx: Context): Promise<CommonResponse> {
    try {
      const query: {
        userId?: number;
        trainingId?: number;
        trainingStatus?: string;
        startDate?: string;
        endDate?: string;
        checklistId?: number;
      } = ctx.request.query;
      let result: Result = { success: true, response: "", statusCode: 200 };
      const whereCondition: any = { isActive: true };
      if (query.userId) {
        whereCondition.userId = query.userId;
      }
      if (query.trainingId) {
        whereCondition.trainingId = query.trainingId;
      }
      if (query.trainingStatus) {
        const trainingStatusParsed = JSON.parse(query.trainingStatus);
        whereCondition.trainingStatus = { [Op.in]: trainingStatusParsed };
      }
      if (query.startDate && query.endDate) {
        whereCondition.scheduledStartDate = { [Op.gte]: moment(parseInt(query.startDate)) };
        whereCondition.scheduledEndDate = { [Op.lte]: moment(parseInt(query.endDate)) };
      }
      if (query.checklistId) {
        let distinctChecklistCount = await arrowup.userChecklistInfos.count({
          col: 'checklistId',
          where: { checklistId: query.checklistId, },
        });
        result.response = { count: distinctChecklistCount };
      } else {
        let distinctTrainingCount = await arrowup.userCourseTrainings.count({
          col: 'trainingId',
          distinct: true,
          where: whereCondition,
        });
        result.response = { count: distinctTrainingCount };
      }
      return result;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getTrainingByParentIdOrEstId(ctx: Context): Promise<CommonResponse> {
    try {
      const query: {
        estId?: number;
        parentId?: number;
      } = ctx.request.query;
      const isEstablishmentExists = ctx.request['isEstablishmentExists'];
      let result: Result = { success: true, response: "", statusCode: 200 };

      let userCourseTrainingData;
      if (query.estId) {
        userCourseTrainingData = await arrowup.userCourseTrainings.findAll({
          where: { estId: query.estId, isActive: true },
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('trainingId')), 'trainingId']
          ],
          order: [['trainingId', 'ASC']],
        });
      } else if (query.parentId) {
        userCourseTrainingData = await arrowup.userCourseTrainings.findAll({
          where: { estId: isEstablishmentExists.estIdentifyingKey, isActive: true },
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('trainingId')), 'trainingId']
          ],
        });
      }
      userCourseTrainingData = JSON.parse(JSON.stringify(userCourseTrainingData));
      const trainingIds = userCourseTrainingData.map((ele) => ele.trainingId);

      const trainingData = await arrowup.trainings.findAll({
        where: {
          trainingId: {
            [Op.in]: trainingIds,
          },
        },
        include: [
          {
            model: arrowup.trainingLanguages,
            attributes: ['language'],
            include: [{
              model: arrowup.supportDatas,
            }]
          },
          {
            model: arrowup.supportDatas,
          }
        ],
        order: [['trainingId', 'ASC']],
      });
      result.response = trainingData;
      return result;
    } catch (error) {
      console.error(error);
      return;
    }
  }
  async updateUserRole(ctx: Context): Promise<any> {
    let result: Result = { success: true, response: "", statusCode: 200 };
    const { userRoleId, userId } = ctx.request.body
    // update user role id in users
    await arrowup.users.update({ userRoleId }, {
      where: { id: userId }
    });
    // delete related user details in userCourseTrainings and userChecklistInfo  
    await arrowup.userCourseTrainings.destroy({ where: { userId: userId } })
    await arrowup.userChecklistInfos.destroy({ where: { userId: userId } })
    // added user details userCourseTrainings and userChecklistInfo according new role
    await this.establishRelationBetweenCourseAndEmployee(
      userId
    );
    await CommonFunction.establishRelationBetweenChecklistAndEmployee(
      userId
    );
    result = {
      success: true,
      response: Message.USER_ROLE_UPDATED,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK
    }
    return result
  }

}
const userService: UserService = new UserService();
export default userService;