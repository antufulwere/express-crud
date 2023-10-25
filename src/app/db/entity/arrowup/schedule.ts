import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class Schedule extends Model<InferAttributes<Schedule>, InferCreationAttributes<Schedule>> {
        declare id: CreationOptional<number>;
        declare name: string;
        declare isDeleted: boolean;
        static associate(models: any) {
            Schedule.hasMany(models.checklistSchedules, { foreignKey: "scheduleId" })
            Schedule.hasMany(models.userChecklistInfos, {
                foreignKey: "scheduleId"
            })
            Schedule.hasMany(models.establishmentChecklistScheduleInfos, { foreignKey: "scheduleId" })
        }
    }

    Schedule.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataType.STRING,
            allowNull: false
        },
        isDeleted: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'schedules',
    });
    return Schedule;
};
