import Koa from 'koa';
import convert from 'koa-convert';
import logger from 'koa-logger';
import passport from 'koa-passport';
import mount from 'koa-mount';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import { Middleware } from 'koa-compose';
import errorMiddleware from '../app/core/middleware/ErrorMiddleware';
import config from '../resources/config';
import routes from '../app/routes';
import cors from '@koa/cors';
import {koaBody} from 'koa-body';
import Cron from '../app/cron/Cron';

const app: Koa = new Koa();
const _use: any = app.use;
app.use = (x: Middleware<any>) => _use.call(app, convert(x));
app.use(cors({
	origin: '*',
	exposeHeaders: ['Content-Type', 'Authorization', 'Accept', 'accessToken', 'accesstoken',  'idtoken', 'idToken'],
	credentials: true,
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'accessToken', 'accesstoken', 'idtoken', 'idToken']
}));

app.use(helmet());
app.use(logger());
app.use(koaBody({
	multipart: true,
	urlencoded: true
}));
app.use(errorMiddleware.errorMiddleware());
app.use(passport.initialize());
app.use(passport.session());

routes(app);

// show swagger only if the NODE_ENV is development and stagging
if (['development', 'stagging','production'].includes(config.environment)) {
	app.use(mount('/swagger', serve(`${process.cwd()}/src/resources/swagger`)));
}

app.listen(config.port, () => {
	console.log(`Server started at ${config.port}`);
	Cron.initializeCron(config.cronTime, Cron.cronJobToNotifyUsers);
});
