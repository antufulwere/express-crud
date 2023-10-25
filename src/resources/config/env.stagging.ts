export default {
	environment: 'stagging' || process.env.NODE_ENV,
	baseUrl: '/api/v1',
	session: process.env.SESSION || 'secret-token',
	token: process.env.TOKEN || 'secret-jwt-token',
	database: {
		name: process.env.DB_NAME || 'launda',
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || 'root',
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || '5432',
		dialect: process.env.DB_DIALECT || 'postgres'
	},
	notificationApi: process.env.NOTIFICATION_URL,
	siteLink: process.env.SITE_LINK,
	brokerLink: process.env.BROKER_LINK,
	linkDuration:process.env.LINK_DURATION,
	link: process.env.FRONTEND_LOGIN_URL || 'https://learning.systangostudios.com/auth/login',
	logo: process.env.SYSTANGO_LOGO || 'https://systango-arrowup-training-staging.s3.ap-south-1.amazonaws.com/Systango.png',
	aws: {
		accessKey: process.env.AWS_ACCESS_KEY || '',
		secretKey: process.env.AWS_SECRET_KEY || '',
		region: process.env.AWS_REGION || '',
		signatureVersion: process.env.AWS_SIGNATURE || '',
		s3BucketName: process.env.S3_BUCKET || '',
		s3BaseUrl: process.env.S3_BASE_URL || ''
	},
	cronTime: process.env.CRONTIME || '0 10 * * *',
	client_id:process.env.CLIENT_ID,
	client_secret:process.env.CLIENT_SECRET,
	redirect_uri: process.env.REDIRECT_URI,
};
