import {
  DataTypes,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize/types";
import { Model } from "sequelize";

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
  class Checklist extends Model<
    InferAttributes<Checklist>,
    InferCreationAttributes<Checklist>
  > {
    declare id: CreationOptional<number>;
    declare checklistName: string;
    declare createdOn: Date;
    declare isDeleted: boolean;
    declare thumbnailUrl: string;
    static associate(models: any) {
      Checklist.hasMany(models.checklistTasks, { foreignKey: "checklistId" });
      Checklist.hasMany(models.checklistSchedules, {
        foreignKey: "checklistId",
      });
      Checklist.hasMany(models.userChecklistInfos, {
        foreignKey: "checklistId",
      });
    }
  }

  Checklist.init(
    {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      checklistName: {
        type: DataType.STRING,
        allowNull: false,
      },
      createdOn: {
        type: DataType.DATE,
        allowNull: false,
        // defaultValue: Date.now(),
      },
      isDeleted: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      thumbnailUrl: {
        type: DataType.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "checklists",
    }
  );
  return Checklist;
};
