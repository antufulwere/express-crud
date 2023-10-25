import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class ParentEstablishment extends Model<InferAttributes<ParentEstablishment>, InferCreationAttributes<ParentEstablishment>> {
		declare estParentId: CreationOptional<number>;
		declare estParentName: string;
		declare status: string;
		declare createdOn: Date;
		declare imageLink: string;
		declare accentColorFirst: string;
		declare accentColorSecond: string;

		static associate(models: any) {
			ParentEstablishment.hasMany(models.establishments, {
				foreignKey: 'estParentId',
			});
			ParentEstablishment.hasMany(models.establishmentChecklistScheduleInfos, {
				foreignKey: 'parentId',
			});
			ParentEstablishment.hasMany(models.establishmentCourseInfos, {
				foreignKey: "parentId"
			})
			ParentEstablishment.hasMany(models.establishmentFormInfos, { foreignKey: 'parentId' });
			ParentEstablishment.hasMany(models.parentRoles, { foreignKey: 'parentId' });
		}
	}
	ParentEstablishment.init({
		estParentId: {
			type: DataType.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		estParentName: {
			type: DataType.STRING,
			allowNull: false,
			unique: {
				name: 'estParentName',
				msg: 'Parent name already exists',
			},
		},
		status: {
			type: DataType.ENUM('Inactive', 'Active', 'Deleted'),
			allowNull: false,
			defaultValue: 'Active',
			validate: {
				isIn: {
					args: [
						['Inactive', 'Active', 'Deleted']
					],
					msg: 'Establishment status should be one of Inactive, Active or Deleted'
				}
			}
		},
		imageLink: {
			type: DataType.STRING,
			allowNull: true,
			defaultValue: ''
		},
		accentColorFirst: {
			type: DataType.STRING,
			allowNull: true,
		},
		accentColorSecond: {
			type: DataType.STRING,
			allowNull: true,
		},
		createdOn: {
			type: DataType.DATE,
			allowNull: true,
			// defaultValue: new Date()
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'parentEstablishments',
	});
	return ParentEstablishment;
};
