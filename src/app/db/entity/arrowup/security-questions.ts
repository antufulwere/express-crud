import {
    DataTypes,
    Sequelize,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize/types";
import { Model} from "sequelize";

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class SecurityQuestions extends Model<
        InferAttributes<any>,
        InferCreationAttributes<any>
    > {
        declare id: CreationOptional<number>;
        declare question: string;
        declare isActive: boolean;
    }
    SecurityQuestions.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataType.INTEGER,
                autoIncrement: true,
            },
            question: {
                allowNull: true,
                type: DataType.STRING,
            },
            isActive: {
                type: DataType.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: "securityQuestions",
        }
    );
    return SecurityQuestions;
};
