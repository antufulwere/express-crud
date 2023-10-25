import { Context } from "koa";
import arrowup from "../db/entity/arrowup";
import Message from "../constant/Messages";
import HttpStatusCode from "../constant/HttpStatusCode";
import UserVariables from "../constant/UserVariables";
import { Op } from "sequelize";
import UserService from "./UserService";
import CommonFunction from "../utils/CommonFunction";
import moment from "moment";
import config from "../../resources/config";
import _ from "lodash";
import commonFunction from "../utils/CommonFunction";

class Establishment {
  constructor() { }

  async addEstablishment(ctx: Context): Promise<any> {
    try {
      let success = true,
        response = "",
        statusCode = 0,
        result: any = {};
      const body: any = ctx.request.body;
      let establishment: any;
      body["estParentId"] = ctx.params.estParentId;
      const alreadyFound = await arrowup.establishments.findOne({
        where: { estIdentifyingKey: body["estIdentifyingKey"] },
      });
      if (alreadyFound) {
        response = Message.EST_ALREADY_EXISTS;
        success = false;
      }
      if (success) {
        let userErr: any, userData: any;
        // await seq.sequelizeInst.transaction(async function (transaction: any) {
        const success = true,
          response = "",
          statusCode = 0;
        body.createdOn = new Date()
        const data: any = await arrowup.establishments.create(body);
        establishment = JSON.parse(JSON.stringify(data));
        establishment.user = {};
        if (establishment) {
          const role = await arrowup.userRoles.findOne({
            where: {
              slug: UserVariables.SAFETY_LEAD_ROLE,
            },
          });
          // onboard saftey lead
          // body['userPosition'] = 'BOH' //not sure what its value will be so for now added this
          body["userRoleId"] = role.id;
          body["estIdentifyingKey"] = parseInt(establishment.estIdentifyingKey);
          body["isEstAdd"] = true;
          console.log("passing values for saftey lead-", body);
          const { response, statusCode, success, error } =
            await UserService.addUser(ctx);
          console.log(
            " response, statusCode, success, error ",
            response,
            statusCode,
            success,
            error
          );
          userErr = !success
            ? " but saftey lead is not onboarded due to some reason"
            : "";
          establishment.user = success ? response : {};
        }
        // });
        console.log("userErr", userErr);
        result = {
          userErr: `Location onboarded successfully${userErr}`,
          response: establishment,
          statusCode: HttpStatusCode.HTTP_CREATED,
          success: true,
        };
        await CommonFunction.assignImageToEst(
          ctx.params.estParentId,
          establishment.estIdentifyingKey
        );
        await CommonFunction.assignFormsToEst(establishment.estIdentifyingKey);
      } else {
        result = {
          response,
          statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
          success,
          error: {
            details: [{ message: response }],
          },
        };
      }
      console.log('11111111111111111 \n\n', result);
      return result;
    } catch (err) {
      console.log('addEstablishment >>>>>>>>>>> ', err);
      return {
        response: err.message,
        statusCode: HttpStatusCode.HTTP_INTERNAL_SERVER_ERROR,
        success: false,
      };
    }
  }

  async updateEstablishment(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const id = ctx.params.estId;
    const estParentId = ctx.params.estParentId;
    let success = true,
      response = "",
      statusCode = 0,
      result: any = {};
    const isExists = await arrowup.establishments.findOne({
      where: { estIdentifyingKey: id, estParentId },
    });
    if (!isExists) {
      response = Message.LOCATION_NOT_FOUND;
      success = false;
      statusCode = HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY;
      result = {
        response,
        statusCode,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      body["deletedOn"] =
        body["status"] == UserVariables.DELETED_VALUE ? new Date() : null;
      const establishment = await arrowup.establishments.update(body, {
        where: { estIdentifyingKey: id },
        returning: true,
        plain: true,
      });
      let estStatus: any = {},
        userStatus: any = {};
      if (body.status) {
        if (UserVariables.DELETED_STATUS == body.status) {
          userStatus.isDeleted = true;
        } else if (UserVariables.INACTIVE_STATUS == body.status) {
          userStatus.isActive = false;
        } else {
          userStatus.isActive = true;
        }
        console.log(userStatus, "userStatususerStatus", estStatus);
        const establishment = isExists;
        console.log(
          "establishment.estIdentifyingKey === \n\n",
          establishment.estIdentifyingKey
        );
        await CommonFunction.updateEstAndUsers(
          establishment.estIdentifyingKey,
          {
            estStatus,
            userStatus,
          }
        );
      }
      result = {
        response: establishment[1],
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    }
    return result;
  }
  async getEstablishments(ctx: Context): Promise<any> {
    const queryParams: any = ctx.query;
    const userId = queryParams["user_id"];
    const query = queryParams["searchText"];
    const pageNo = queryParams["page_no"];
    const pageSize = queryParams["page_size"];
    const estParentId = ctx.params.estParentId;
    const status = queryParams["status"];
    const onlyUserEstablishment: boolean = queryParams['onlyUserEstablishment'];
    const where: any = {};
    const month: any = queryParams.month ? queryParams.month : new Date()
    console.log(month, "monthmonthmonthmonth------------")
    let startDate = moment(month).startOf("month").format('YYYY-MM-DD');
    let endDate = moment(month).endOf("month").format('YYYY-MM-DD');
    const parentId: number = ctx.params.parentId;
    console.log(month, startDate, "-", endDate, "====================", parentId)
    const weightageData = await arrowup.supportDatas.findAll({
      where: {
        key: {
          [Op.in]: UserVariables.WEIGHTAGE
        }
      },
      raw: true
    });
    const microWeight: any = weightageData.find(function (data: any) {
      // console.log("data-----", data)
      return data.key == UserVariables.MICRO_WEIGHTAGE
    })
    console.log(microWeight, "--------------microWeight")

    const foundationWeight: any = weightageData.find(function (data: any) {
      return data.key == UserVariables.FOUNDATION_WEIGHTAGE
    })

    const checklistWeight: any = weightageData.find(function (data: any) {
      return data.key == UserVariables.CHECKLIST_WEIGHTAGE
    })

    const formWeight: any = weightageData.find(function (data: any) {
      return data.key == UserVariables.FORM_WEIGHTAGE
    })


    let establishmentIds = [];
    if (estParentId) {
      where.estParentId = estParentId;
    }
    if (status) {
      where.status = status;
    }
    if (query) {
      where[Op.or] = [
        {
          estName: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          estBrandName: {
            [Op.iLike]: `%${query}%`,
          },
        },
        {
          state: {
            [Op.iLike]: `%${query}%`,
          },
        },
      ];
    }
    console.log("where=========", where);
    const offset = pageNo,
      limit = pageSize;
    let skip = 0;
    if (offset >= 1) {
      skip = (offset - 1) * limit;
    } else {
      skip = offset;
    }
    console.log(where, "where");
    const success = true,
      response = "",
      statusCode = 0;
    // need saftey lead role for searching
    const role = await arrowup.userRoles.findOne({
      where: {
        slug: UserVariables.SAFETY_LEAD_ROLE,
      },
    });

    if (onlyUserEstablishment && userId) {
      const establishments = await arrowup.userEstablishments.findAll({
        where: { userId: userId },
        attributes: [],
        include: [
          {
            model: arrowup.establishments,
            attributes: ['estIdentifyingKey'],
            required: false,
          }
        ],
        order: [["estId", "ASC"]],
      })
      establishments.forEach((establishment: any) => {
        const parent = JSON.parse(JSON.stringify(establishment))
        for (const parentEstablishments of parent.establishments) {
          establishmentIds.push(parentEstablishments.estIdentifyingKey);
        }
      })

      where[Op.and] = [{
        estIdentifyingKey: {
          [Op.in]: establishmentIds
        }
      }]
      const allEstablishments = await arrowup.establishments.findAll({
        where,
        include: {
          model: arrowup.users,
          where: {
            userRoleId: role.id,
            isActive: true,
          },
          required: false,
          limit: 1,
        },
        offset: skip,
        limit,
        order: [["estIdentifyingKey", "ASC"]],
      });

      let result = [];
      await Promise.all(allEstablishments.map(async function (est: any) {
        est = JSON.parse(JSON.stringify(est))
        const score = await commonFunction.fetchEstReports(est.estIdentifyingKey, startDate, endDate, { microWeight, foundationWeight, checklistWeight, formWeight })
        est.score = score
        result.push(est)
      }))

      const total: number = await arrowup.establishments.count({ where });

      return {
        response: result,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
        total,
      };
    }

    const establishments = await arrowup.establishments.findAll({
      where,
      include: {
        model: arrowup.users,
        where: {
          userRoleId: role.id,
          isActive: true,
        },
        required: false,
        limit: 1,
      },
      offset: skip,
      limit,
      order: [["estIdentifyingKey", "ASC"]],
    });
    const total: number = await arrowup.establishments.count({ where });
    return {
      response: establishments,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
      total,
    };
  }
  async getEstablishment(ctx: Context): Promise<any> {
    const id = ctx.params.estId;
    const estParentId = ctx.params.estParentId;
    let result: any = {};
    // need saftey lead role for searching
    const role = await arrowup.userRoles.findOne({
      where: {
        slug: UserVariables.SAFETY_LEAD_ROLE,
      },
    });
    const establishment = await arrowup.establishments.findOne({
      where: { estIdentifyingKey: parseInt(id), estParentId },
      attributes: { exclude: ["estIdentifyingKey"] },
      include: [{
        model: arrowup.users,
        where: {
          userRoleId: role.id,
          estIdentifyingKey: parseInt(id),
          isActive: true,
        },
        limit: 1,
        required: false,
      },
      {
        model: arrowup.parentEstablishments,
        attributes: ['accentColorFirst', 'accentColorSecond'],
      }
      ],
    });
    if (establishment) {
      result = {
        response: establishment,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response: Message.LOCATION_NOT_FOUND,
        statusCode: HttpStatusCode.HTTP_NO_CONTENT,
        success: false,
        error: {
          details: [{ message: Message.LOCATION_NOT_FOUND }],
        },
      };
    }
    return result;
  }
  async login(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    let success = true,
      response = "",
      statusCode = 0,
      roleRestricted = true,
      result: any = {};
    const where: any = {};
    const data = await arrowup.establishments.findOne({
      where: { estIdentifyingKey: body["estIdentifyingKey"] },
      include: [{
        model: arrowup.parentEstablishments,
        attributes: ['accentColorFirst', 'accentColorSecond']
      }]
    });
    if (!data) {
      response = Message.EST_NOT_FOUND;
      success = false;
    } else {
      if (data.status == UserVariables.DELETED_STATUS) {
        response = Message.DELETED_LOGIN;
        success = false;
      } else if (data.status == UserVariables.INACTIVE_STATUS) {
        response = Message.INACTIVE_LOGIN;
        success = false;
      }
    }
    if (success) {
      result = {
        response: data,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
    } else {
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    }
    return result;
  }
  async getUsers(ctx: Context): Promise<any> {
    let success = true,
      response = "",
      statusCode = 0,
      result: any = {};
    const queryParams: any = ctx.query;
    const type = queryParams["type"];
    const query = queryParams["query"];
    const pageNo = queryParams["page_no"];
    const pageSize = queryParams["page_size"];
    const estIdentifyingKey = queryParams["estIdentifyingKey"];
    const status = queryParams["status"];
    const include = queryParams["include"]; // training
    const data = await arrowup.establishments.findOne({
      where: { estIdentifyingKey },
    });
    if (!data) {
      response = Message.EST_NOT_FOUND;
      success = false;
      result = {
        response,
        statusCode: HttpStatusCode.HTTP_UNPROCESSABLE_ENTITY,
        success,
        error: {
          details: [{ message: response }],
        },
      };
    } else {
      const where: any = {
        estIdentifyingKey,
      };
      if (type) {
        where.userRoleId = type;
      }
      if (status) {
        where.isDeleted = status == "Active" ? false : true;
      }
      if (query) {
        where[Op.or] = [
          {
            userFirstName: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            userLastName: {
              [Op.iLike]: `%${query}%`,
            },
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
          },
        ];
      }
      let includes: Array<any> = [
        {
          model: arrowup.userRoles,
        },
        {
          model: arrowup.supportDatas,
          required: false,
        },
      ];
      if (include && include === "training") {
        let startDate = moment().startOf("week");
        let endDate = moment().endOf("week");
        includes.push({
          model: arrowup.userCourseTrainings,
          where: {
            estId: estIdentifyingKey,
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
            "id",
            "scheduledStartDate",
            "scheduledEndDate",
            "trainingType",
            "userId",
            "isCompleted",
          ],
        });
      }
      const offset = pageNo,
        limit = pageSize;
      let skip = 0;
      if (offset >= 1) {
        skip = (offset - 1) * limit;
      } else {
        skip = offset;
      }
      console.log(skip, "akippppp", limit);
      let users = await arrowup.users.findAll({
        where,
        include: includes,
        attributes: { exclude: ["password"] },
        offset: skip,
        limit,
        order: [["id", "ASC"]],
      });
      const total: number = await arrowup.users.count({ where });
      users = JSON.parse(JSON.stringify(users));
      let userIdIndexMapping: any = {};
      let userTrainingStatistics: any = {};
      let whereConditionForStatistics: any = { isActive: true };
      for (let index = 0; index < users.length; index++) {
        userIdIndexMapping[users[index].id] = index;
        const user = users[index];
        userTrainingStatistics = await UserService.getTrainingStatisticsByUserId(user.id, whereConditionForStatistics);
        user.totalDurationOfUser = userTrainingStatistics.totalDurationOfUser;
        user.completedCount = userTrainingStatistics.completedCount;
        user.inProgressCount = userTrainingStatistics.inProgressCount;
        user.notStartedCount = userTrainingStatistics.notStartedCount;
        const userAnswers = await arrowup.userAnswers.findOne({ where: { userId: user.id } })
        console.log(userAnswers);
        if (userAnswers) {
          user.isUserAnswerSet = true
        } else {
          user.isUserAnswerSet = false
        }
      }
      users = await this.setTrainingIndicators(
        users,
        estIdentifyingKey,
        userIdIndexMapping
      );
      users = await this.setTrendingIndicator(
        users,
        estIdentifyingKey,
        userIdIndexMapping
      );
      // trainingDurationStatistics();
      result = {
        response: users,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
        total,
      };
    }
    return result;
  }

  async setTrainingIndicators(
    users: any,
    estIdentifyingKey: string,
    userIdIndexMapping: any
  ) {
    try {
      // due date within 3 days
      // mon-sunday = 1 week
      let supportData: any = await arrowup.supportDatas.findOne({
        where: {
          key: "trainingDueDays",
        },
      });
      supportData = JSON.parse(JSON.stringify(supportData));
      const dueDateInterval: number = 86400000 * Number(supportData.value); // 3 days
      const userIds: Array<number> = users.map((ele) => ele.id);
      if (users) {
        const currentTime = Date.now();
        for (let index = 0; index < users.length; index++) {
          const user = users[index];
          let completedTrainingsCount: number = 0;
          users[index]["allTrainingsCompleted"] = true;
          users[index]["dueDateReached"] = false;
          users[index]["totalOnboardingTrainingsCompleted"] = 0;
          users[index]["totalOnboardingTrainingsAssigned"] = 0;
          let dueDateReachedCalculated = false;
          const trainings: Array<any> = user.userCourseTrainings;
          if (trainings && trainings.length) {
            // if any training is assigned to this user
            // executes for each user
            for (
              let innerIndex = 0;
              innerIndex < trainings.length;
              innerIndex++
            ) {
              const training = trainings[innerIndex];
              if (training.isCompleted) {
                completedTrainingsCount += 1;
              } else {
                // if training is not completed
                if (!dueDateReachedCalculated) {
                  let scheduleEndTime = new Date(
                    training.scheduledEndDate
                  ).getTime();
                  let daysRemaining = scheduleEndTime - currentTime;
                  if (daysRemaining <= dueDateInterval) {
                    dueDateReachedCalculated = true;
                    users[index]["dueDateReached"] = true;
                  }
                }
              }
            }
            if (trainings.length !== completedTrainingsCount) {
              users[index]["allTrainingsCompleted"] = false;
            }
          } else {
            // if no training is assigned to this user
            users[index]["allTrainingsCompleted"] = false;
          }
        }
      }
      // total onboarding training assigned
      let totalOnBoardingTrainingAssigned: any =
        await arrowup.userCourseTrainings.findAll({
          where: {
            userId: {
              [Op.in]: userIds,
            },
            trainingType: UserVariables.ON_BOARDING_TRAINING_TYPE,
            estId: estIdentifyingKey,
          },
          attributes: ["trainingType", "userId", "isCompleted"],
        });
      totalOnBoardingTrainingAssigned = JSON.parse(
        JSON.stringify(totalOnBoardingTrainingAssigned)
      );
      if (totalOnBoardingTrainingAssigned) {
        for (
          let index = 0;
          index < totalOnBoardingTrainingAssigned.length;
          index++
        ) {
          const element = totalOnBoardingTrainingAssigned[index];
          let user: any = users[userIdIndexMapping[element.userId]];
          if (!user["totalOnboardingTrainingsCompleted"]) {
            user["totalOnboardingTrainingsCompleted"] = 0;
          }
          if (!user["totalOnboardingTrainingsAssigned"]) {
            user["totalOnboardingTrainingsAssigned"] = 0;
          }
          if (element && element.isCompleted) {
            user["totalOnboardingTrainingsCompleted"] += 1;
          }
          user["totalOnboardingTrainingsAssigned"] += 1;
        }
      }
      return users;
    } catch (error) {
      console.error(
        "########## error in setTrainingIndicators ########## \n\n",
        error
      );
      return users;
    }
  }

  async setTrendingIndicator(
    users: any,
    estIdentifyingKey: string,
    userIdIndexMapping: any
  ) {
    try {
      const itemLimit: number = 3;
      const dueDate: any = moment();
      const userIds: Array<number> = users.map((ele) => ele.id);
      let usersData: any = await arrowup.users.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
        include: [
          {
            model: arrowup.userCourseTrainings,
            where: {
              estId: estIdentifyingKey,
              scheduledEndDate: {
                [Op.gte]: dueDate,
              },
              courseTrainingType: {
                [Op.ne]: UserVariables.MICRO_EXTRA_TYPE,
              },
              isActive: true
            },
            order: [["scheduledEndDate", "DESC"]],
            attributes: ["id", "userId", "isCompleted", "scheduledEndDate"],
            limit: itemLimit,
          },
          {
            model: arrowup.userChecklistInfos,
            where: {
              estId: estIdentifyingKey,
              scheduledEndDate: {
                [Op.gte]: dueDate,
              },
              type: {
                [Op.ne]: UserVariables.MICRO_EXTRA_TYPE,
              },
              isActive: true,
            },
            order: [["scheduledEndDate", "DESC"]],
            attributes: ["id", "userId", "isCompleted", "scheduledEndDate"],
            limit: itemLimit,
          },
        ],
        attributes: ["id"],
      });
      usersData = JSON.parse(JSON.stringify(usersData));
      for (let index = 0; index < usersData.length; index++) {
        // for each user
        let completedItemsCount: number = 0;
        const user = usersData[index];
        let mergedItems: Array<any> = user.userCourseTrainings.concat(
          user.userChecklistInfos
        );
        mergedItems.sort((a, b) => {
          return (
            new Date(a.scheduledEndDate).getTime() -
            new Date(b.scheduledEndDate).getTime()
          );
        });
        for (let index = 0; index < 3; index++) {
          const items = mergedItems[index];
          if (items && items.isCompleted) {
            completedItemsCount += 1;
          }
        }
        if (completedItemsCount < 2) {
          users[userIdIndexMapping[user.id]]["trending"] = false;
        } else {
          users[userIdIndexMapping[user.id]]["trending"] = true;
        }
      }
      return users;
    } catch (error) {
      console.error(
        "########## error in setTrendingIndicator ########## \n\n",
        error
      );
      return users;
    }
  }

  async getEstablishmentItems(ctx: Context): Promise<any> {
    const estId: number = ctx.params.estId;
    const userId: number = ctx.state.user.id;
    const itemLimit: number = 10;
    const dueDate: any = moment();
    let result: any = {};
    let priorityTrainingList: any = [];
    let allUsersCourseTrainings: any = await arrowup.userCourseTrainings.findAll({
      include: {
        model: arrowup.trainings,
        include: [
          {
            model: arrowup.trainingLanguages,
          },
        ],
      },
      where: {
        userId: userId,
        estId: estId,
        isCompleted: false,
        isActive: true,
        scheduledEndDate: {
          [Op.gte]: dueDate,
        },
      },
      order: [["scheduledEndDate", "DESC"]],
      limit: itemLimit,
    });
    let userCourseTrainings = JSON.parse(JSON.stringify(allUsersCourseTrainings))
    for (const userCourseTraining of allUsersCourseTrainings) {
      if (userCourseTraining.isPriorityTraining) {
        priorityTrainingList.push(JSON.parse(JSON.stringify(userCourseTraining)));
        _.remove(userCourseTrainings, { id: userCourseTraining.id })
      } else {
        if (userCourseTraining.trainingType != UserVariables.MICRO_TRAINING_TYPE || userCourseTraining.courseTrainingType == "OPTIONAL") {
          _.remove(userCourseTrainings, { id: userCourseTraining.id })
        }
      }
    }
    priorityTrainingList.sort((a, b) => {
      return (
        new Date(a.scheduledEndDate).getTime() -
        new Date(b.scheduledEndDate).getTime()
      );
    });
    userCourseTrainings = userCourseTrainings ? userCourseTrainings : [];
    userCourseTrainings = JSON.parse(JSON.stringify(userCourseTrainings));
    let userChecklistInfos: any = await arrowup.userChecklistInfos.findAll({
      include: {
        model: arrowup.checklists,
        attributes: ["thumbnailUrl", "checklistName"],
      },
      where: {
        userId: userId,
        estId: estId,
        isCompleted: false,
        scheduledEndDate: {
          [Op.gte]: dueDate,
        },
        isActive: true,
      },
      order: [["scheduledEndDate", "DESC"]],
      limit: itemLimit,
    });
    userChecklistInfos = userChecklistInfos ? userChecklistInfos : [];
    userChecklistInfos = JSON.parse(JSON.stringify(userChecklistInfos));
    let checklists: Array<any> = this.parseChecklist(userChecklistInfos);
    let mergedItems: Array<any> = userCourseTrainings.concat(checklists);
    mergedItems.sort((a, b) => {
      return (
        new Date(a.scheduledEndDate).getTime() -
        new Date(b.scheduledEndDate).getTime()
      );
    });
    const userCourseTrainingResult = priorityTrainingList.concat(mergedItems);
    result = {
      response: userCourseTrainingResult,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
    return result;
  }
  async getEstablishmentForms(ctx: Context): Promise<any> {
    const estId: number = ctx.params.estId;
    const user: any = ctx.state.user;
    let result: any = {};
    const where: any = {
      estId,
    };
    //find role ids for list
    const roles: any = await arrowup.userRoles.findAll({
      where: {
        slug: {
          [Op.in]: UserVariables.FORMS_ROLE,
        },
      },
    });
    const roleIds: Array<number> = roles.map((ele: any) => ele.id);
    if (roleIds.indexOf(user.userRoleId) == -1) {
      where.status = UserVariables.COMPLETE_STATUS;
    }
    let forms: any = await arrowup.establishmentFormInfos.findAll({
      include: {
        model: arrowup.forms,
      },
      where,
    });
    let finalResult: any = JSON.parse(JSON.stringify(forms));
    finalResult.map((item: any) => {
      item.formData = item.formData ? JSON.parse(item.formData) : {};
      return item;
    });
    result = {
      response: finalResult,
      total: forms.length,
      statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
      success: true,
    };
    return result;
  }
  async updateEstablishmentForms(ctx: Context): Promise<any> {
    const body: any = ctx.request.body;
    const id = ctx.params.id;
    let success: boolean = true,
      response: string = "",
      statusCode: number = 0,
      result: any = {};
    const isFormExists = await arrowup.establishmentFormInfos.findOne({
      where: { id },
    });
    if (!isFormExists) {
      result = {
        response: Message.FORM_NOT_FOUND,
        success: false,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        error: {
          details: [{ message: Message.FORM_NOT_FOUND }],
        },
      };
    } else {
      if (body.status == UserVariables.COMPLETE_STATUS) {
        body.completionDate = moment(new Date(), "YYYY-MM-DD");
        body.completedBy = ctx.state.user.id;
      }
      if (body.formData) {
        body.formData = JSON.stringify(body.formData);
      }
      const form = await arrowup.establishmentFormInfos.update(body, {
        where: { id },
        returning: true,
        plain: true,
      });
      if (form) {
        result = {
          response: form,
          statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
          success: true,
        };
      } else {
        throw new Error(Message.SOMETHING_WENT_WRONG);
      }
    }
    return result;
  }

  async getUserActivities(ctx: Context): Promise<any> {
    try {
      const userId: number = ctx.params.userId;
      const estId: number = ctx.params.estId;
      const queryParams: any = ctx.query;
      let result: any = {};
      let mergedItems: Array<any> = [];
      let where: any = {
        id: Number(userId),
      };
      const startDate = moment().subtract(3, "months");
      const endDate = moment();
      let includes: Array<any> = [
        {
          model: arrowup.userCourseTrainings,
          include: [
            {
              model: arrowup.trainings,
              include: [
                {
                  model: arrowup.trainingLanguages,
                  attributes: [
                    ["trainingThumbnail", "thumbnail"],
                    "trainingId",
                  ],
                },
              ],
            },
          ],
          where: {
            estId: estId,
            isActive: true
          },
          order: [["scheduledEndDate", "DESC"]],
          attributes: [
            "id",
            "userId",
            "isCompleted",
            "scheduledEndDate",
            "trainingType",
            "markAbsent",
            "completedOn",
          ],
          required: false,
        },
        {
          model: arrowup.userChecklistInfos,
          include: [
            {
              model: arrowup.checklists,
            },
          ],
          where: {
            estId: estId,
            isActive: true,
          },
          order: [["scheduledEndDate", "DESC"]],
          attributes: [
            "id",
            "userId",
            "isCompleted",
            "scheduledEndDate",
            "markAbsent",
            "completedOn",
            "checklistId",
          ],
          required: false,
        },
      ];
      if (queryParams && queryParams.filter && queryParams.filter !== "ALL") {
        includes[0].where["scheduledEndDate"] = {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        };
      }
      let user: any = await arrowup.users.findOne({
        where: where,
        include: includes,
        attributes: ["id"],
      });
      user = JSON.parse(JSON.stringify(user));
      if (user) {
        if (user.userCourseTrainings) {
          user.userCourseTrainings.forEach((userCourseTraining, index) => {
            userCourseTraining.isAbsent = userCourseTraining.markAbsent;
            if (userCourseTraining.training) {
              if (userCourseTraining.training.trainingLanguages) {
                userCourseTraining.training.trainingLanguages.forEach(
                  (languages) => {
                    if (languages.thumbnail) {
                      languages.thumbnail = `${config.aws.s3BaseUrl}/${languages.thumbnail}`;
                    }
                  }
                );
              }
            }
          });
        } else {
          user.userCourseTrainings = [];
        }
        let checklists: Array<any> = this.parseChecklist(
          user.userChecklistInfos
        );
        mergedItems = user.userCourseTrainings.concat(checklists);
        mergedItems.sort((a, b) => {
          if (a && a.scheduledEndDate && b && b.scheduledEndDate) {
            return (
              new Date(a.scheduledEndDate).getTime() -
              new Date(b.scheduledEndDate).getTime()
            );
          }
        });
      }
      result = {
        response: mergedItems,
        statusCode: HttpStatusCode.HTTP_SUCCESS_OK,
        success: true,
      };
      return result;
    } catch (error) {
      console.log("########### getUserActivities error ######## \n\n", error);
    }
  }

  parseChecklist(userChecklistInfos: Array<any>): Array<any> {
    let checklists: Array<any> = [];
    let parsedChecklist: any = {};
    if (userChecklistInfos) {
      for (let index = 0; index < userChecklistInfos.length; index++) {
        const element = userChecklistInfos[index];
        if (!parsedChecklist[element.checklistId]) {
          parsedChecklist[element.checklistId] = {};
        }
        if (!parsedChecklist[element.checklistId].checklistName) {
          parsedChecklist[element.checklistId] = {
            id: element.id,
            checklistId: element.checklistId,
            checklistName: element.checklist.checklistName,
            scheduledEndDate: element.scheduledEndDate,
            isCompleted: element.isCompleted,
            thumbnailUrl: `${config.aws.s3BaseUrl}/${element.checklist.thumbnailUrl}`,
            totalTaskCount: 0,
            completedTaskCount: 0,
            isAbsent: element.markAbsent ? true : false,
            completedOn: element.completedOn,
          };
        }
        parsedChecklist[element.checklistId].totalTaskCount += 1;
        if (element.isCompleted) {
          parsedChecklist[element.checklistId].completedTaskCount += 1;
        }
      }
      for (const key in parsedChecklist) {
        if (Object.prototype.hasOwnProperty.call(parsedChecklist, key)) {
          const element = parsedChecklist[key];
          element.isCompleted = (element.completedTaskCount == element.totalTaskCount) ? true : false
          checklists.push(element);
        }
      }
    }
    return checklists;
  }
}

const EstablishmentService: Establishment = new Establishment();
export default EstablishmentService;
