import {
  DataTypes,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize/types";
import { Model } from "sequelize";

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
  class UserCourseTrainings extends Model<
    InferAttributes<any>,
    InferCreationAttributes<any>
  > {
    declare id: CreationOptional<number>;
    declare isDeleted: boolean;
    declare isPriorityTraining: boolean;
    declare type: string;
    declare courseTrainingType: string;
    declare endDate: Date;
    declare startDate: Date;
    declare trainingSequence: number;
    declare trainingType: string;
    declare dueBeforeDays: number;
    declare markAbsent: boolean;
    declare chapterCompleted: number;
    declare chapterAssign: number;
    declare resumeSession: JSON;

    static associate(models: any) {
      UserCourseTrainings.belongsTo(models.trainings, {
        foreignKey: "trainingId",
      });
      UserCourseTrainings.belongsTo(models.courses, { foreignKey: "courseId" });
      UserCourseTrainings.belongsTo(models.establishments, {
        foreignKey: "estId",
      });
      UserCourseTrainings.hasMany(models.users, {
        foreignKey: "id",
        sourceKey: 'userId',
      });
    }
  }
  UserCourseTrainings.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
      },
      userId: {
        // allowNull: false, // fk
        type: DataType.INTEGER,
        //        references: { model: "users", key: "id" },
      },
      markAbsent: {
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      scheduledStartDate: {
        allowNull: true,
        type: DataType.DATE,
      },
      scheduledEndDate: {
        allowNull: true,
        type: DataType.DATE,
      },
      isCompleted: {
        type: DataType.BOOLEAN,
        allowNull: false,
      },
      startedOn: {
        allowNull: true,
        type: DataType.DATE,
      },
      completedOn: {
        allowNull: true,
        type: DataType.DATE,
      },
      lastAccessedOn: {
        allowNull: true,
        type: DataType.DATE,
      },
      durationCompleted: {
        allowNull: true,
        type: DataType.DATE,
      },
      trainingmonth: {
        type: DataType.STRING,
        allowNull: true,
      },
      updatedOn: {
        allowNull: true,
        type: DataType.DATE,
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
      },
      trainingStatus: {
        type: DataType.STRING,
        allowNull: false,
      },
      modifiedBy: {
        allowNull: true, // fk
        type: DataType.INTEGER,
        references: { model: "users", key: "id" },
      },
      courseTrainingType: {
        allowNull: true,
        type: DataType.STRING,
      },
      trainingType: {
        allowNull: true,
        type: DataType.STRING,
      },
      dueBeforeDays: {
        allowNull: true,
        type: DataType.INTEGER,
      },
      trainingSequence: {
        allowNull: true,
        type: DataType.INTEGER,
      },
      chapterCompleted: {
        allowNull: true,
        type: DataType.INTEGER
      },
      chapterAssign: {
        allowNull: true,
        type: DataType.INTEGER
      },
      resumeSession: {
        allowNull: true,
        type: DataType.JSON,
      },
      isPriorityTraining: {
        allowNull: true,
        type: DataType.BOOLEAN,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "userCourseTrainings",
    }
  );
  return UserCourseTrainings;
};
