import { DataTypes, CreationOptional, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class EstablishmentFormInfos extends Model<InferAttributes<EstablishmentFormInfos>, InferCreationAttributes<EstablishmentFormInfos>> {
        declare dueDate: Date;
        declare id: CreationOptional<number>;
        declare formData: string;
        declare status: string;
        declare completionDate: Date;
        declare formUrl: string;

        static associate(models: any) {
            EstablishmentFormInfos.belongsTo(models.parentEstablishments, {
                foreignKey: "parentId",
            })
            EstablishmentFormInfos.belongsTo(models.establishments, {
                foreignKey: "estId",
            })
            EstablishmentFormInfos.belongsTo(models.users, {
                foreignKey: "completedBy",
            })
            EstablishmentFormInfos.belongsTo(models.forms, {
                foreignKey: "formId",
            })
        }
    }
    EstablishmentFormInfos.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        formData: {
            type: DataType.STRING,
            allowNull: true
        },
        status: {
            type: DataType.STRING,
            allowNull: true
        },
        formUrl: {
            type: DataType.STRING,
            allowNull: true
        },
        completionDate: {
            type: DataType.DATE,
            allowNull: true
        },
        dueDate: {
            type: DataType.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'establishmentFormInfos',
    });
    return EstablishmentFormInfos;
};
