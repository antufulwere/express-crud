export default {
	port: process.env.SERVER_PORT || 3000,
	link: process.env.FRONTEND_LOGIN_URL || 'https://learning.systangostudios.com/auth/login',
	logo: process.env.SYSTANGO_LOGO || 'https://systango-arrowup-training-staging.s3.ap-south-1.amazonaws.com/Systango.png',
	cronTime: process.env.CRONTIME || '0 10 * * *',
	client_id:process.env.CLIENT_ID,
	client_secret:process.env.CLIENT_SECRET,
	redirect_uri: process.env.REDIRECT_URI,
};
