import bcrypt from "bcrypt";
import logger from "../../logger";
import arrowup from "../db/entity/arrowup";
import Messages from "../constant/Messages";
import { Op } from "sequelize";
import crypto from "crypto";
import base64url from "base64url";
import moment from "moment";
import HttpStatusCode from "../constant/HttpStatusCode";
import UserVariables from "../constant/UserVariables";
import randomstring from 'randomstring';

class CommonFunction {
  async comparePassword(plainPass: string, hashword: string): Promise<boolean> {
    const isPasswordMatch = await bcrypt.compare(plainPass, hashword);
    return isPasswordMatch;
  }
  randomNumber(length: number): number {
    return Math.floor(
      Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  }
  async assignImageToEst(parentId: number, estId?: number): Promise<boolean> {
    try {
      logger.info(`assignImageToEst called-${parentId}-${estId}`);
      let result: any = {};
      const where: any = {
        estParentId: parentId,
      };
      const parent: any = await arrowup.parentEstablishments.findOne({
        where: { estParentId: parentId },
      });
      if (parent) {
        if (estId) {
          where.estIdentifyingKey = estId;
        }
        console.log(where, "where", parent.imageLink);
        await arrowup.establishments.update(
          {
            imageLink: parent.imageLink,
          },
          {
            where,
          }
        );
        result = {
          message: "Updated Establishment imageLink",
          data: {},
        };
      } else {
        logger.error(`${Messages.PARENT_NOT_FOUND} - ${parentId}`);
        result = {
          message: `${Messages.PARENT_NOT_FOUND} - ${parentId}`,
          data: {},
        };
      }
      logger.info(
        `result of upload images ti est helper function-${JSON.stringify(
          result
        )}`
      );
      return result;
    } catch (err) {
      console.log(err, "error");
      logger.error(
        `found err in assignImageToEst function-${JSON.stringify(err)}`
      );
      return err;
    }
  }
  async establishRelationBetweenChecklistAndEmployee(userId: number) {
    // get establishment ID from users table for userId
    console.log("establishRelationBetweenChecklistAndEmployee-", userId);
    const where: any = {
      id: userId,
      isDeleted: false,
    };
    const user: any = await arrowup.users.findOne({
      where,
    });
    if (user && user.estIdentifyingKey) {
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
      // get data from EstablishmentChecklistInfo table for user and its est
      const establishmentChecklists: any =
        await arrowup.establishmentChecklistScheduleInfos.findAll({
          where,
        });
      // console.log(JSON.stringify(establishmentChecklists))
      const scheduleIds = establishmentChecklists.map(
        (ele: any) => ele.scheduleId
      );
      console.log(scheduleIds, "--scheduleIds");
      const establishmentChecklist: any =
        await arrowup.checklistSchedules.findAll({
          where: {
            scheduleId: {
              [Op.in]: scheduleIds,
            },
          },
        });
      if (establishmentChecklist && establishmentChecklist.length) {
        // get schedule id for courses
        const checklistIds = establishmentChecklist.map(
          (ele: any) => ele.checklistId
        );
        const checklistTask = await arrowup.checklistTasks.findAll({
          where: {
            checklistId: {
              [Op.in]: checklistIds,
              // isDeleted: false
            },
          },
        });
        const userchecklistTask: Array<number> = checklistTask.map(
          (ele: any) => {
            const data = establishmentChecklist.find((val: any) => {
              return val.checklistId == ele.checklistId;
            });
            const start = moment(data.startDate), end = moment(data.endDate)
            let userChecklistData = {
              userId: userId,
              estId: user.estIdentifyingKey,
              scheduleId: data.scheduleId,
              checklistId: ele.checklistId,
              scheduledStartDate: start.startOf('day').toString(),
              scheduledEndDate: end.endOf('day').toString(),
              taskId: ele.taskId,
              sequence: ele.sequence,
              type: data.type,
            };
            return userChecklistData;
          }
        );

        // add data in User_Course_Training table
        await arrowup.userChecklistInfos.bulkCreate(userchecklistTask);
      } else {
        console.log("##### Schedule not found in DB for establishment #####");
      }
    } else {
      console.log("##### user not found in DB #####");
    }
    return;
  }
  async getUsersForEstablishment(estId: number, role?: any) {
    const where: any = {
      estIdentifyingKey: estId,
      // isDeleted: false,
    };
    if (role) {
      where.userRoleId = role;
    }
    let users: any = await arrowup.users.findAll({
      where,
    });
    return users;
  }
  async updateEstAndUsers(estId: number, update: any) {
    try {
      console.log("## updateEstAndUsers starts ##");
      //set status of est
      const updatedEsts: any = await arrowup.establishments.update(
        update.estStatus,
        {
          where: {
            estIdentifyingKey: estId,
          },
        }
      );
      if (updatedEsts) {
        let users: any = await this.getUsersForEstablishment(estId);
        console.log("usersfound", users.length);
        if (users) {
          const userIds = users.map((ele: any) => ele.id);
          console.log("updating users-", userIds);
          await arrowup.users.update(update.userStatus, {
            where: {
              id: {
                [Op.in]: userIds,
              },
            },
          });
        } else {
          console.log("## Users not found in estalishment ##");
        }
      } else {
        console.log("## Est not able to update ##");
      }
      console.log("## updateEstAndUsers ends ##");
      return;
    } catch (err) {
      console.log(
        "err while updating users and est in function updateEstAndUsers",
        err
      );
    }
  }
  async generateConfimationToken(length: number) {
    const rlength = (length * 3) / 4;
    return base64url(crypto.randomBytes(rlength));
  }
  async assignFormsToEst(estId: number) {
    try {
      console.log("## assignFormsToEst starts ##");
      const est: any = await arrowup.establishments.findOne({
        where: {
          estIdentifyingKey: estId,
        },
      });
      if (est) {
        //find parent
        const parentData: any = await arrowup.parentEstablishments.findOne({
          where: {
            estParentId: est.estParentId,
          },
          attributes: ["estParentId"],
        });
        //find forms
        const forms: any = await arrowup.forms.findAll({
          where: { isDeleted: false },
        });
        const supportData: any = await arrowup.supportDatas.findOne({
          where: {
            key: "formDueDays",
          },
        });
        const estForms: Array<number> = forms.map((ele: any) => {
          const dueDate = moment(new Date(), "DD-MM-YYYY").add(
            supportData.value,
            "days"
          );
          console.log(dueDate, "--dueDate");
          let estData: any = {
            parentId: parentData.estParentId,
            estId: estId,
            formId: ele.formId,
            dueDate,
            formData: null,
            status: "NOT_STARTED",
            completionDate: null,
            formUrl: null,
            completedBy: null,
          };
          return estData;
        });
        await arrowup.establishmentFormInfos.bulkCreate(estForms);
        console.log("## assignFormsToEst ends ##");
      } else {
        console.log("est not found");
      }
    } catch (err) {
      console.log("erorrrrrrrrrrrrrrrrrrrr", err);
    }
  }

  serviceResponse(data: any, statusCode?: number, success?: boolean) {
    let result = {
      response: data ? data : {},
      statusCode: statusCode ? statusCode : HttpStatusCode.HTTP_SUCCESS_OK,
      success: success ? success : true,
    };
    return result;
  }

  trainingDurationCount(trainingLanguages: any): number {
    try {
      let totalDuration: number = 0;
      trainingLanguages.forEach((element) => {
        const durationString = element.duration; // Assuming duration in HH:MM format
        const [hours, minutes] = durationString.split(':');
        const durationMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        totalDuration += durationMinutes;
      });
      return totalDuration;
    } catch (error) {
      console.log("error", error);
      logger.error(
        `found error in trainingDurationCount function-${JSON.stringify(error)}`
      );
      return error;
    }
  }
  async fetchEstReports(estId: number, startDate: string, endDate: string, weightageData: any) {
    const microWeight: any = weightageData.microWeight
    const foundationWeight: any = weightageData.foundationWeight
    const checklistWeight: any = weightageData.checklistWeight
    const formWeight: any = weightageData.formWeight

    const microCompleted = await arrowup.userCourseTrainings.count({
      where: {
        isActive: true,
        markAbsent: false,
        estId,
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        trainingType: UserVariables.MICRO_TRAINING_TYPE,
        courseTrainingType: UserVariables.MICRO_COURSE_TYPE,
        isCompleted: true,
      },
    });
    const microTotal = await arrowup.userCourseTrainings.count({
      where: {
        isActive: true,
        markAbsent: false,
        estId,
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        trainingType: UserVariables.MICRO_TRAINING_TYPE,
        courseTrainingType: UserVariables.MICRO_COURSE_TYPE,
      },
    });
    console.log(microTotal, "microTotal----", microCompleted)

    const foundationCompleted = await arrowup.userCourseTrainings.count({
      where: {
        isActive: true,
        markAbsent: false,
        estId,
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        courseTrainingType: UserVariables.MICRO_COURSE_TYPE,
        trainingType: UserVariables.ON_BOARDING_TRAINING_TYPE,
        isCompleted: true
      },
    });
    const foundationTotal = await arrowup.userCourseTrainings.count({
      where: {
        isActive: true,
        markAbsent: false,
        estId,
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        trainingType: UserVariables.ON_BOARDING_TRAINING_TYPE,
        courseTrainingType: UserVariables.MICRO_COURSE_TYPE,
      },
    });
    console.log(foundationTotal, "foundationTotal----", foundationCompleted)
    const checklistsTotal = await arrowup.userChecklistInfos.count({
      where: {
        isActive: true,
        markAbsent: false,
        estId,
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        }
      },
    });

    const checklistsCompleted = await arrowup.userChecklistInfos.count({
      where: {
        isActive: true,
        estId,
        markAbsent: false,
        scheduledEndDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        isCompleted: true
      },
    });
    console.log(checklistsTotal, "checklistsTotal----", checklistsCompleted)
    const formComplete = await arrowup.establishmentFormInfos.count({
      where: {
        estId,
        completionDate: {
          [Op.ne]: null
        }
      },
    });
    const formTotal = await arrowup.establishmentFormInfos.count({
      where: {
        estId
      },
    });
    const microTotalCompleted: number = microTotal ? parseFloat(((microCompleted / microTotal) * microWeight.value).toFixed(1)) : 0
    const foundationTotalCompleted: number = foundationTotal ? parseFloat(((foundationCompleted / foundationTotal) * foundationWeight.value).toFixed(1)) : 0
    const checklistTotalCompleted: number = checklistsTotal ? Math.round((checklistsCompleted / checklistsTotal) * checklistWeight.value) : 0
    const formTotalCompleted: number = formTotal ? parseFloat(((formComplete / formTotal) * formWeight.value).toFixed(1)) : 0
    // const totalWeightage: number = parseFloat(microWeight.value) + parseFloat(foundationWeight.value) + parseFloat(checklistWeight.value) + parseFloat(formWeight.value)
    const totalCompleted: number = microTotalCompleted + foundationTotalCompleted + checklistTotalCompleted + formTotalCompleted
    return totalCompleted
  }

  generatePassword() {
    const options = {
      length: UserVariables.PASSWORD_LENGTH
    };
    return `${randomstring.generate(options)}`;
  }

  convertMinsToHrsMins(minutes) {
    let hour: any = Math.floor(minutes / 60);
    let minute: any = minutes % 60;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    return hour + ':' + minute;
  }
}
const commonFunction: CommonFunction = new CommonFunction();
export default commonFunction;
