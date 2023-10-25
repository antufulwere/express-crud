import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class UserChecklistInfos extends Model<InferAttributes<UserChecklistInfos>, InferCreationAttributes<UserChecklistInfos>> {
        declare id: CreationOptional<number>;
        declare checklistResponse: string;
        declare scheduledStartDate: Date;
        declare scheduledEndDate: Date;
        declare updatedOn: Date;
        declare isActive: boolean;
        declare sequence: number;
        declare type: number;
        declare createdOn: Date;
        declare isCompleted: boolean;
        declare markAbsent: boolean;
        declare completedOn: Date;
        static associate(models: any) {
            UserChecklistInfos.belongsTo(models.users, { foreignKey: "userId" })
            UserChecklistInfos.belongsTo(models.establishments, { foreignKey: "estId" });
            UserChecklistInfos.belongsTo(models.schedules, { foreignKey: "scheduleId" })
            UserChecklistInfos.belongsTo(models.checklists, { foreignKey: "checklistId" });
            UserChecklistInfos.belongsTo(models.tasks, { foreignKey: "taskId" });
        }
    }
    UserChecklistInfos.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sequence: {
            type: DataType.INTEGER,
            allowNull: true
        },
        checklistResponse: {
            type: DataType.STRING,
            allowNull: true
        },
        scheduledStartDate: {
            type: DataType.DATE,
            allowNull: true
        },
        scheduledEndDate: {
            type: DataType.DATE,
            allowNull: true
        },
        isActive: {
            type: DataType.BOOLEAN,
            defaultValue: true
        },
        updatedOn: {
            type: DataType.DATE,
            defaultValue: new Date()
        },
        type: {
            type: DataType.STRING,
            allowNull: true
        },
        createdOn: {
            type: DataType.DATE,
            // defaultValue: new Date()
        },
        isCompleted: {
            type: DataType.BOOLEAN,
            defaultValue: false
        },
        markAbsent: {
            type: DataType.BOOLEAN,
            defaultValue: false
        },
        completedOn: {
            type: DataType.DATE,
            allowNull: true
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'userChecklistInfos',
    });
    return UserChecklistInfos;
};
