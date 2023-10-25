import { DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class EstablishmentChecklistScheduleInfo extends Model<InferAttributes<EstablishmentChecklistScheduleInfo>, InferCreationAttributes<EstablishmentChecklistScheduleInfo>> {
        declare createdOn: Date;
        static associate(models: any) {
            EstablishmentChecklistScheduleInfo.belongsTo(models.parentEstablishments, {
                foreignKey: "parentId",
            })
            EstablishmentChecklistScheduleInfo.belongsTo(models.establishments, {
                foreignKey: "estId",
            })
            EstablishmentChecklistScheduleInfo.belongsTo(models.schedules, {
                foreignKey: "scheduleId",
            })
            EstablishmentChecklistScheduleInfo.belongsTo(models.userRoles, {
                foreignKey: "role",
            })
        }
    }
    EstablishmentChecklistScheduleInfo.init({
        createdOn: {
            type: DataType.DATE,
            allowNull: true,
            // defaultValue: new Date(),
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'establishmentChecklistScheduleInfos',
    });
    return EstablishmentChecklistScheduleInfo;
};
