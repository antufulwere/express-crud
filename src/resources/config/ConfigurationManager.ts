export class ConfigurationManager {
	private configurationDetails: any;
	constructor(isReadFromEnv = false) {
		if (isReadFromEnv) {
			require('dotenv').config();
		}
		const env: string = process.env.NODE_ENV || 'development';
		this.configurationDetails = Object.assign({}, require(`./env.${env}`).default, require('./env.common').default);
	}

	getConfigurationDetails(): any {
		return this.configurationDetails;
	}
}
