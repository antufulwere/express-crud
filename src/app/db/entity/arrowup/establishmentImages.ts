import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class EstablishmentImages extends Model<InferAttributes<EstablishmentImages>, InferCreationAttributes<EstablishmentImages>> {
		declare id: CreationOptional<number>;
		declare estId: number;
		declare imageKey: string;
		declare imageUrl: string;
		}
	EstablishmentImages.init({
		id: {
			type: DataType.BIGINT,
			autoIncrement: true,
			primaryKey: true,
		},
		estId: {
			type: DataType.INTEGER,
			allowNull: false
		},
		imageKey: {
			type: DataType.STRING,
			allowNull: true
		},
		imageUrl: {
			type: DataType.STRING,
			allowNull: true
		},
	}, {
		sequelize,
		timestamps: false,
		modelName: 'establishmentImages',
	});
	return EstablishmentImages;
};
