import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class SupportDatas extends Model<InferAttributes<SupportDatas>, InferCreationAttributes<SupportDatas>> {
		declare id: CreationOptional<number>;
		declare key: string;
		declare value: string;
		declare slug: string;
		static associate(models: any) {
			SupportDatas.hasMany(models.trainings, {
				foreignKey: "trainingType",
			})
			SupportDatas.hasMany(models.users, {
				foreignKey: 'userPosition',
			});
			SupportDatas.hasMany(models.trainings, {
				foreignKey: "trainingType",
			})
		}
	}
	SupportDatas.init({
		id: {
			type: DataType.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		key: {
			type: DataType.STRING,
			allowNull: false,
		},
		slug: {
			type: DataType.STRING,
			allowNull: true,
		},
		value: {
			type: DataType.STRING,
			allowNull: false,
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: 'supportDatas',
	});
	return SupportDatas;
};
