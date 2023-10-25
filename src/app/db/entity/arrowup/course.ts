import { DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>> {
        // declare courseId: number;
        declare courseName: string;
        // declare courseType: string;
        // declare startDate: Date;
        // declare dueDate: Date;
        // declare dueBeforeDays: Date;
        declare isDeleted: boolean;
        declare createdOn: Date;
        // declare type: string;
        declare id: number;

        static associate(models: any) {
            Course.hasMany(models.courseTrainings)
            Course.hasMany(models.establishmentCourseInfos, {
                foreignKey: "courseId"
            })
            Course.hasMany(models.userCourseTrainings, {
                foreignKey: "courseId"
            })
        }
    }
    Course.init({
       id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        courseName: {
            type: DataType.STRING,
            allowNull: false
        },
        isDeleted: {
            type: DataType.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        createdOn: {
            type: DataType.DATE,
            allowNull: true,
            // defaultValue: new Date(),
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'courses',
    });
    return Course;
};
