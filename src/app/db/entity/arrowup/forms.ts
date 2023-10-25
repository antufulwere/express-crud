import { DataTypes, Sequelize, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { Model } from 'sequelize';

module.exports = (sequelize: Sequelize, DataType: typeof DataTypes) => {
    class Form extends Model<InferAttributes<Form>, InferCreationAttributes<Form>> {
        declare formId: CreationOptional<number>;
        declare formName: string;
        declare isDeleted: boolean;
        static associate(models: any) {
            Form.hasMany(models.establishmentFormInfos, { foreignKey: 'formId' });
        }
    }

    Form.init({
        formId: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        formName: {
            type: DataType.STRING,
            allowNull: false
        },
        isDeleted: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'forms',
    });
    return Form;
};
