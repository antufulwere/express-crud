import {
    DataTypes,
    Sequelize,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize/types";
import { Model } from "sequelize";

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class UserAnswers extends Model<
        InferAttributes<any>,
        InferCreationAttributes<any>
    > {
        declare id: CreationOptional<number>;
        declare answer: string;
        declare createdOn: Date;

        static associate(models: any) {
            UserAnswers.belongsTo(models.securityQuestions, {
                foreignKey: "questionId",
            });
            UserAnswers.hasMany(models.users, {
                foreignKey: "id",
            });
        }
    }

    UserAnswers.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataType.INTEGER,
                autoIncrement: true,
            },
            answer: {
                allowNull: false,
                type: DataType.STRING,
            },
            createdOn: {
                type: DataType.DATE,
                allowNull: true,
            },
           
        },
        {
            sequelize,
            timestamps: false,
            modelName: "userAnswers",
        }
    );
    return UserAnswers;
};
