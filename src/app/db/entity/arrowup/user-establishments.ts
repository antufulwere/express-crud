import {
    DataTypes,
    Sequelize,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize/types";
import { Model } from "sequelize";


module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class UserEstablishments extends Model<
        InferAttributes<any>,
        InferCreationAttributes<any>
    > {
        declare id: CreationOptional<number>;
        declare createdOn: Date;


        static associate(models: any) {
            UserEstablishments.hasMany(models.users, {
                sourceKey: "userId",
                foreignKey: "id"
            });
            UserEstablishments.hasMany(models.establishments, {
                sourceKey: "estId",
                foreignKey: "estIdentifyingKey",
            });
        }
    }
    UserEstablishments.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataType.INTEGER,
                autoIncrement: true,
            },
            userId:{
                allowNull:false,
                type:DataType.INTEGER
            },
            estId:{
                allowNull:false,
                type:DataType.INTEGER
            },
            createdOn: {
                allowNull: false,
                type: DataType.DATE,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: "userEstablishments",
        }
    );
    return UserEstablishments;
};
