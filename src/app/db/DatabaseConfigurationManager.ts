import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
export class DatabaseConfigurationManager {
	db: {} = {};
	constructor(private modelDirPath: string, private databaseName: string, private user: string, private password: string, private options: {} = {}) {
	}

	// loading the database models
	loadDatabaseModels(): {} {
		// establishing the database connection
		const sequelize = new Sequelize(this.databaseName, this.user, this.password, this.options);
		sequelize.authenticate().then(() => {
			console.log('Connection has been established successfully.');
		}).catch(error => {
			console.log(`Unable to connect to the database : ${error}`);
		});

		fs.readdirSync(this.modelDirPath).filter((file: string) => {
			return (file.indexOf('.') !== 0) && (!['index.js', 'index.ts'].includes(file));
		}).forEach((file: string) => {
			const model = require(path.join(this.modelDirPath, file))(sequelize, DataTypes);
			this.db[model.name] = model;
		});

		Object.keys(this.db).forEach((modelName: string) => {
			if ('associate' in this.db[modelName]) {
				this.db[modelName].associate(this.db);
			}
		});

		this.db['sequelize'] = this;
		this.db['sequelizeInst'] = sequelize;
		return this.db;
	}
}
