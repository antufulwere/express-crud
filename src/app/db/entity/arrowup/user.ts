import {
  DataTypes,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize/types";
import { Model } from "sequelize";
import bcrypt from "bcrypt";

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
  class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    declare id: CreationOptional<number>;
    declare userFirstName: string;
    declare userLastName: string;
    declare userEmailId: string;
    declare userContactNumber: string;
    declare password: string;
    declare resetPasswordToken: string;
    declare resetPasswordSentAt: Date;
    declare userDateOfJoining: Date;
    declare isActive: boolean;
    declare isDeleted: boolean;
    declare createdOn: Date;
    declare userName: string;
    declare countryIsoCode: string;
    declare countryIsdCode: string;
    declare textBox: string;
    declare isChecked: boolean;
    declare '2FAKey': string;
    declare employeeCode: string;
    declare userPosition: number;

    static associate(models: any) {
      User.belongsTo(models.userRoles, {
        foreignKey: "userRoleId",
        foreignKeyConstraint: true,
      });
      User.hasOne(models.accessTokens, {
        foreignKey: "userId",
        foreignKeyConstraint: true,
      });
      User.belongsTo(models.parentEstablishments, {
        foreignKey: "estIdentifyingKey",
      });
      User.belongsTo(models.supportDatas, { foreignKey: "userPosition" });
      User.hasMany(models.userChecklistInfos, {
        foreignKey: "userId",
      });
      User.hasMany(models.userCourseTrainings, {
        foreignKey: "userId",
      });
      User.hasMany(models.establishmentFormInfos, {
        foreignKey: "completedBy",
      });
      User.hasMany(models.summaries, {
        foreignKey: "userId",
      });
      User.hasMany(models.userAnswers, {
        foreignKey: "userId",
      });
      User.hasMany(models.userEstablishments, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeCode: {
        type: DataType.STRING,
        allowNull: false,
      },
      userFirstName: {
        type: DataType.STRING,
        allowNull: false,
      },
      userLastName: {
        type: DataType.STRING,
        allowNull: false,
      },
      password: {
        type: DataType.STRING,
        allowNull: false,
      },
      userEmailId: {
        type: DataType.STRING,
        allowNull: true,
        unique: false,
      },
      userContactNumber: {
        type: DataType.STRING,
        allowNull: true,
        unique: false,
      },
      resetPasswordToken: {
        type: DataType.STRING,
        allowNull: true,
      },
      resetPasswordSentAt: {
        type: DataType.DATE,
        allowNull: true,
      },
      userDateOfJoining: {
        type: DataType.DATE,
        allowNull: true,
        // defaultValue: new Date(),
      },
      isActive: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isDeleted: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdOn: {
        type: DataType.DATE,
        allowNull: true,
        unique: false,
      },
      userName: {
        type: DataType.STRING,
        allowNull: false,
        unique: true,
      },
      countryIsoCode: {
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "US",
      },
      countryIsdCode: {
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "+1",
      },
      textBox: {
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "",
      },
      isChecked: {
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      '2FAKey': {
        type: DataType.STRING,
        allowNull: true,
      },
      userPosition: {
        type: DataType.NUMBER,
        allowNull: false,
        unique: false,
      },
    },
    {
      hooks: {
        beforeSave: (users, options) => {
          if (options.fields.includes("password")) {
            users.password = bcrypt.hashSync(users.password, 10);
          }
        },
        // beforeBulkCreate: (users, options) => {
        //   if (options.fields.includes("password")) {
        //     for (let index = 0; index < users.length; index++) {
        //       users[index].password = bcrypt.hashSync(users[index].password, 10);
        //     }
        //   }
        // }
      },
      sequelize,
      timestamps: false,
      modelName: "users",
    }
  );
  return User;
};
