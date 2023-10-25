import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class TrainingLanguages extends Model<InferAttributes<TrainingLanguages>, InferCreationAttributes<TrainingLanguages>> {
        declare id: CreationOptional<number>;
        // declare trainingId: number;
        // declare language: string;
        declare trainingThumbnail: string;
        declare trainingURL: string;
        declare duration: string;
        declare hostingUrl: string;
        static associate(models: any) {
            TrainingLanguages.belongsTo(models.supportDatas, { foreignKey: "language" })
            TrainingLanguages.belongsTo(models.trainings, { foreignKey: "trainingId" })
        }
    }
    TrainingLanguages.init({
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // trainingId: {
        // 	type: DataType.INTEGER,
        // 	allowNull: false
        // },
        trainingURL: {
            type: DataType.STRING,
            allowNull: false
        },
        // language: {
        //     type: DataType.STRING,
        //     allowNull: false
        // },
        trainingThumbnail: {
            type: DataType.STRING,
            allowNull: true,
        },
        duration: {
            type: DataType.STRING,
            allowNull: true,
        },
        hostingUrl: {
            type: DataType.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'trainingLanguages',
    });
    return TrainingLanguages;
};
