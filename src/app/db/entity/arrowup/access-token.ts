import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
	class AccessToken extends Model<InferAttributes<AccessToken>, InferCreationAttributes<AccessToken>> {
		declare id: CreationOptional<number>;
		declare token: string;
		static associate(models: any) {
			AccessToken.belongsTo(models.users, { foreignKey: 'userId' });
		}
	}
	AccessToken.init({
		id: {
			type: DataType.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		token: {
			type: DataType.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: 'accessTokens',
	});
	return AccessToken;
};
