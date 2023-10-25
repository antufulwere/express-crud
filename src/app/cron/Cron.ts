import cron from 'node-cron';
import arrowup from '../db/entity/arrowup';
import Message from "../constant/Messages";
import ApiCall from "../third-party/axios";
import config from "../../resources/config";
import { Op } from 'sequelize';
import moment from "moment";
import userVariables from '../constant/UserVariables';

class CronManager {
    constructor() { }

    async initializeCron(cronTime: any, operations: Function) {
        try {
            console.log('cronTime : ', cronTime);
            cron.schedule(cronTime, () => {
                // console.log('######################## Cron job exection started ########################');
                operations();
                // console.log('######################## Cron job exection completed ########################');
            });
        } catch (error) {
            console.error('########## initializeCron error ########## \n', error);
        }
    }

    async cronJobToNotifyUsers() {
        await this.sendTrainingReminderNotification();
        await this.sendChecklistReminderNotification();
    }

    async sendTrainingReminderNotification() {
        try {
            console.log('##### sendTrainingReminderNotification starts #####');
            const currentDate = moment().valueOf();
            const dueBeforeDate = moment().add(userVariables.REMINDER_NOTIFICATION_DUE_DAYS, "days").valueOf();
            let userCourseTrainings = await arrowup.userCourseTrainings.findAll({
                where: {
                    // dueBeforeDays: 3,
                    scheduledEndDate: {
                        [Op.gt]: currentDate,
                        [Op.lte]: dueBeforeDate
                    },
                    isCompleted: false,
                    isActive: true
                },
                include: [{
                    model: arrowup.trainings
                }, {
                    model: arrowup.users,
                    required: true,
                    where: {
                        isActive: true,
                    }
                }]
            })
            userCourseTrainings = JSON.parse(JSON.stringify(userCourseTrainings));
            const message = Message.CRON.SCHEDULED;
            const today = moment();
            let endDate = null;
            let dueBeforeDays = null;
            for (let i = 0; i < userCourseTrainings.length; i++) {
                let ele = userCourseTrainings[i];
                console.log(ele);
                endDate = moment(ele.scheduledEndDate);
                dueBeforeDays = endDate.diff(today, 'days');
                const sendData = {
                    establishment: '',
                    estId: '',
                    email: ele.users[0].userEmailId,
                    comment: message,
                    name: `${ele.users[0].userFirstName} ${ele.users[0].userLastName}`,
                    sendTrainingMail: true,
                    username: '',
                    trainingName: ele.training.trainingName,
                    dueBeforeDays: dueBeforeDays,
                    logo: '',
                    subject: Message.TRAINING_REMINDER
                }
                console.log('............... ', sendData);

                let success = await ApiCall.makePostCall(config.notificationApi, sendData);
            }
            console.log('##### sendTrainingReminderNotification ends #####');
        } catch (error) {
            console.error('##### sendTrainingReminderNotification error #####', error);
        }

    }

    async sendChecklistReminderNotification() {
        try {
            console.log('##### sendChecklistReminderNotification starts #####');
            const currentDate = moment().valueOf();
            const dueBeforeDate = moment().add(userVariables.REMINDER_NOTIFICATION_DUE_DAYS, "days").valueOf();
            let userChecklistInfos = await arrowup.userChecklistInfos.findAll({
                where: {
                    scheduledEndDate: {
                        [Op.gt]: currentDate,
                        [Op.lte]: dueBeforeDate
                    },
                    isCompleted: false,
                    isActive: true,
                },
                include: [{
                    model: arrowup.checklists
                }, {
                    model: arrowup.users,
                    required: true,
                    where: {
                        isActive: true,
                    }
                }]
            })
            userChecklistInfos = JSON.parse(JSON.stringify(userChecklistInfos));
            const message = Message.CRON.SCHEDULED;
            const today = moment();
            let endDate = null;
            let dueBeforeDays = null;
            for (let i = 0; i < userChecklistInfos.length; i++) {
                let ele = userChecklistInfos[i];
                console.log(ele);
                endDate = moment(ele.scheduledEndDate);
                dueBeforeDays = endDate.diff(today, 'days');
                const sendData = {
                    establishment: '',
                    estId: '',
                    email: ele.user.userEmailId,
                    comment: message,
                    name: `${ele.user.userFirstName} ${ele.user.userLastName}`,
                    sendChecklistMail: true,
                    username: '',
                    checklistName: ele.checklist.checklistName,
                    dueBeforeDays: dueBeforeDays,
                    logo: '',
                    subject: Message.CHECKLIST_REMINDER
                }
                console.log('............... ', sendData);

                let success = await ApiCall.makePostCall(config.notificationApi, sendData);
            }
            console.log('##### sendChecklistReminderNotification ends #####');
        } catch (error) {
            console.error('##### sendChecklistReminderNotification error #####', error);
        }

    }
}

const cronManager: CronManager = new CronManager();
export default cronManager;