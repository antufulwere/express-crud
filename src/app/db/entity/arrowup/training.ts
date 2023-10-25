import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class Training extends Model<InferAttributes<Training>, InferCreationAttributes<Training>> {
		declare trainingId: CreationOptional<number>;
		declare trainingName: string;
		declare trainingDescription: string;
		declare trainingDuration: Date;
		// declare trainingType: string;

		static associate(models: any) {
			Training.hasMany(models.courseTrainings, { foreignKey: "trainingId" })
			Training.hasMany(models.trainingLanguages, { foreignKey: "trainingId" })
			Training.belongsTo(models.supportDatas, { foreignKey: "trainingType" })
		}
	}
	Training.init({
		trainingId: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		trainingName: {
			type: DataType.STRING,
			allowNull: false
		},
		// trainingType: {
		// 	type: DataType.STRING,
		// 	allowNull: false
		// },
		trainingDescription: {
			type: DataType.STRING,
			allowNull: true
		},
		trainingDuration: {
			type: DataType.DATE,
			allowNull: true,
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'trainings',
	});
	return Training;
};
