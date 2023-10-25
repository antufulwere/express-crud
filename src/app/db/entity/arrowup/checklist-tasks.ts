import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class ChecklistTasks extends Model<InferAttributes<ChecklistTasks>, InferCreationAttributes<ChecklistTasks>> {
        declare id: CreationOptional<number>;
        declare sequence: number;
        static associate(models: any) {
            ChecklistTasks.belongsTo(models.tasks, { foreignKey: "taskId" })
            ChecklistTasks.belongsTo(models.checklists, { foreignKey: "checklistId" });
        }
    }
    ChecklistTasks.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sequence: {
            type: DataType.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'checklistTasks',
    });
    return ChecklistTasks;
};
