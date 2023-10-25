import {
    DataTypes,
    Sequelize,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize/types";
import { Model } from "sequelize";


module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class Summaries extends Model<
        InferAttributes<any>,
        InferCreationAttributes<any>
    > {
        declare id: CreationOptional<number>;
        declare field: string;
        declare updatedValue: string;
        declare createdOn: Date;

        static associate(models: any) {
            Summaries.belongsTo(models.users, {
                foreignKey: "id",
            });
        }
    }
    Summaries.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataType.INTEGER,
                autoIncrement: true,
            },
            userId: {
                type: DataType.INTEGER,
            },
            field: {
                type: DataType.STRING,
                allowNull: true,
                defaultValue: false
            },
            updatedValue: {
                allowNull: true,
                type: DataType.STRING,
            },
            createdOn: {
                allowNull: false,
                type: DataType.DATE,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: "summaries",
        }
    );
    return Summaries;
};
