import { DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class EstablishmentCourseInfo extends Model<InferAttributes<EstablishmentCourseInfo>, InferCreationAttributes<EstablishmentCourseInfo>> {
        declare createdOn: Date;

        static associate(models: any) {
            EstablishmentCourseInfo.belongsTo(models.parentEstablishments, {
                foreignKey: "parentId",
            })
            EstablishmentCourseInfo.belongsTo(models.establishments, {
                foreignKey: "estId",
            })
            EstablishmentCourseInfo.belongsTo(models.courses, {
                foreignKey: "courseId",
            })
            EstablishmentCourseInfo.belongsTo(models.userRoles, {
                foreignKey: "role",
            })
        }
    }
    EstablishmentCourseInfo.init({
        createdOn: {
            type: DataType.DATE,
            allowNull: true,
            // defaultValue: new Date(),
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'establishmentCourseInfos',
    });
    return EstablishmentCourseInfo;
};
