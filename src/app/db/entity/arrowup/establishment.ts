import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class Establishment extends Model<InferAttributes<Establishment>, InferCreationAttributes<Establishment>> {
		declare estIdentifyingKey: CreationOptional<number>;
		declare estName: string;
		declare status: string;
		declare createdOn: Date;
		declare estEmailId: string;
		declare estContactNumber: string;
		declare addressLine1: string;
		declare city: string;
		declare state: string;
		declare country: string;
		declare deletedOn: Date;
		declare addressLine2: string;
		declare zipcode: string;
		declare estFeedbackEmailId: string;
		declare estBrandName: string;
		declare estCountryIsoCode: string;
		declare estCountryIsdCode: string;
		declare imageLink: string;
		static associate(models: any) {
			Establishment.belongsTo(models.parentEstablishments, {
				foreignKey: 'estParentId',
			});
			Establishment.hasMany(models.users, {
				foreignKey: 'estIdentifyingKey',
			});
			Establishment.hasMany(models.establishmentCourseInfos, {
				foreignKey: "estId"
			})
			Establishment.hasMany(models.userCourseTrainings, {
				foreignKey: "estId"
			})
			Establishment.hasMany(models.establishmentChecklistScheduleInfos, {
				foreignKey: "estId"
			})
			Establishment.hasMany(models.userChecklistInfos, {
				foreignKey: "estId"
			})
			Establishment.hasMany(models.establishmentFormInfos, { foreignKey: 'estId' });
			Establishment.hasMany(models.userEstablishments, {
				foreignKey: 'estId',
			});
		}
	}
	Establishment.init({
		estIdentifyingKey: {
			type: DataType.BIGINT,
			primaryKey: true,
		},
		estName: {
			type: DataType.STRING,
			allowNull: false
		},
		estEmailId: {
			type: DataType.STRING,
			allowNull: true
		},
		estContactNumber: {
			type: DataType.STRING,
			allowNull: true
		},
		addressLine1: {
			type: DataType.STRING,
			allowNull: true
		},
		addressLine2: {
			type: DataType.STRING,
			allowNull: true
		},
		city: {
			type: DataType.STRING,
			allowNull: true
		},
		state: {
			type: DataType.STRING,
			allowNull: true
		},
		country: {
			type: DataType.STRING,
			allowNull: true
		},
		deletedOn: {
			type: DataType.DATE,
			allowNull: true,
			unique: false
		},
		zipcode: {
			type: DataType.STRING,
			allowNull: true,
			unique: false
		},
		estFeedbackEmailId: {
			type: DataType.STRING,
			allowNull: true,
		},
		estBrandName: {
			type: DataType.STRING,
			allowNull: true,
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
		createdOn: {
			type: DataType.DATE,
			allowNull: true,
			unique: false,
			// defaultValue: new Date(),
		},
		estCountryIsoCode: {
			type: DataType.STRING,
			allowNull: true,
			defaultValue: 'US'
		},
		estCountryIsdCode: {
			type: DataType.STRING,
			allowNull: true,
			defaultValue: '+1'
		},
		imageLink: {
			type: DataType.STRING,
			allowNull: true,
			defaultValue: ''
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'establishments',
	});
	return Establishment;
};
