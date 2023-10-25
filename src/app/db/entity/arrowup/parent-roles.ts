import { DataTypes, CreationOptional, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class ParentRoles extends Model<InferAttributes<ParentRoles>, InferCreationAttributes<ParentRoles>> {
        declare id: CreationOptional<number>;

        static associate(models: any) {
            ParentRoles.belongsTo(models.parentEstablishments, {
                foreignKey: "parentId",
            })
            ParentRoles.belongsTo(models.userRoles, {
                foreignKey: "userRoleId",
            })
        }
    }
    ParentRoles.init({
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'parentRoles',
    });
    return ParentRoles;
};
