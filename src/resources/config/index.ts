import { ConfigurationManager } from './ConfigurationManager';

const configurationManager: ConfigurationManager = new ConfigurationManager(true);

const configurationDetails = configurationManager.getConfigurationDetails();

export default configurationDetails;
