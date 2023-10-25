import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class ChecklistSchedules extends Model<InferAttributes<ChecklistSchedules>, InferCreationAttributes<ChecklistSchedules>> {
        declare id: CreationOptional<number>;
        declare type: string;
        declare endDate: Date;
        declare startDate: Date;
        static associate(models: any) {
            ChecklistSchedules.belongsTo(models.checklists, { foreignKey: "checklistId" });
            ChecklistSchedules.belongsTo(models.schedules, { foreignKey: "scheduleId" });
            
        }
    }
    ChecklistSchedules.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataType.STRING,
            allowNull: true
        },
        endDate: {
            type: DataType.DATE,
            allowNull: true
        },
        startDate: {
            type: DataType.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'checklistSchedules',
    });
    return ChecklistSchedules;
};
