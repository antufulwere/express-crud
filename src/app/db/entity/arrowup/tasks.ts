import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
        declare id: CreationOptional<number>;
        declare taskHeader: string;
        declare taskDescription: string;
        declare taskThumbnail: string;
        declare isDeleted: boolean;

        static associate(models: any) {
            Task.belongsTo(models.supportDatas, { foreignKey: "taskType" })
            Task.hasMany(models.checklistTasks, { foreignKey: "taskId" })
            Task.hasMany(models.userChecklistInfos, { foreignKey: "taskId" })
        }
    }
    Task.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        taskHeader: {
            type: DataType.STRING,
            allowNull: false
        },
        taskDescription: {
            type: DataType.STRING,
            allowNull: true
        },
        taskThumbnail: {
            type: DataType.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'tasks',
    });
    return Task;
};
