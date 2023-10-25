import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';
module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class UserRoles extends Model<InferAttributes<UserRoles>, InferCreationAttributes<UserRoles>> {
		declare id: CreationOptional<number>;
		declare roleName: string;
		declare passwordType: string;
		declare isActive: boolean;
		declare isAppRole: boolean;
		declare isLocationSpecific: boolean;
		declare slug: string;
		static associate(models: any) {
			UserRoles.hasMany(models.users, {
				foreignKey: 'userRoleId'
			});
			UserRoles.hasMany(models.establishmentCourseInfos, {
				foreignKey: "role"
			})
			UserRoles.hasMany(models.parentRoles, {
				foreignKey: "userRoleId"
			});
		}
	}
	UserRoles.init({
		id: {
			type: DataType.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		roleName: {
			type: DataType.STRING,
			allowNull: false
		},
		passwordType: {
			type: DataType.STRING,
			allowNull: true
		},
		isActive: {
			type: DataType.BOOLEAN,
			defaultValue: true
		},
		isAppRole: {
			type: DataType.BOOLEAN,
			defaultValue: false
		},
		isLocationSpecific: {
			type: DataType.BOOLEAN,
			defaultValue: true
		},
		slug: {
			type: DataType.STRING,
			allowNull: true
		},
	}, {
		sequelize,
		timestamps: false,
		createdAt: false,
		updatedAt: false,
		modelName: 'userRoles',
	});
	return UserRoles;
};
