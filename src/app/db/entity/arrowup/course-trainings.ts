import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class CourseTrainings extends Model<InferAttributes<CourseTrainings>, InferCreationAttributes<CourseTrainings>> {
        declare id: CreationOptional<number>;
        declare isDeleted: boolean;
        declare type: string;
        // declare dueBeforeDays: number;
        declare endDate: Date;
        declare startDate: Date;
        declare trainingSequence: number;
        declare isPriorityTraining: number;

        static associate(models: any) {
            CourseTrainings.belongsTo(models.trainings, { foreignKey: "trainingId" })
            CourseTrainings.belongsTo(models.courses, { foreignKey: "courseId" });
            CourseTrainings.belongsTo(models.supportDatas, { foreignKey: "dueBeforeDays" })
        }
    }
    CourseTrainings.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataType.STRING,
            allowNull: true
        },
        // dueBeforeDays: {
        //     type: DataType.INTEGER,
        //     allowNull: true
        // },
        endDate: {
            type: DataType.DATE,
            allowNull: true
        },
        startDate: {
            type: DataType.DATE,
            allowNull: true
        },
        trainingSequence: {
            type: DataType.INTEGER,
            allowNull: true
        },
        isDeleted: {
            type: DataType.BOOLEAN,
            defaultValue: false
        },
        isPriorityTraining: {
            type: DataType.BOOLEAN,
            allowNull: true
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'courseTrainings',
    });
    return CourseTrainings;
};
