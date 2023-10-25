import AWS from 'aws-sdk';
import config from '../../resources/config';
import mime from 'mime-types';
import logger from '../../logger';
AWS.config.update({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretKey,
	region: config.aws.region
});

const s3 = new AWS.S3({
	signatureVersion: config.aws.signatureVersion
});

class ImageHandler {
	constructor() { }

	async getS3SignedUrlWithServerless(key: string, width: number = null, height: number = null) {
		const obj: any = {
			bucket: config.aws.s3BucketName,
			key
		};
		if (width && height) { // width and height is integer
			obj.edits = {
				resize: {
					width,
					height,
					fit: 'fill'
				}
			};
		}
		const objString = JSON.stringify(obj);
		const buffer = new Buffer(objString);
		const base64data = buffer.toString('base64');
		return config.aws.serverlessImageHandler + base64data;
	}

	async getSignedS3Url(key: string) {
		const params = {
			Bucket: config.aws.s3BucketName,
			Key: key,
			Expires: parseInt(config.aws.s3SignedUrlExpirationTime)
		};
		const signedUrl = await s3.getSignedUrlPromise('getObject', params);
		return signedUrl;
	}

	async putImageOnS3(key: string, isPublic = false): Promise<string> {
		const params: any = {
			Bucket: config.aws.s3BucketName,
			Key: key,
			Expires: parseInt(config.aws.s3SignedUrlExpirationTime),
			ContentType: mime.lookup(key)
		};

		if (isPublic) {
			params.ACL = 'public-read';
		}
		const signedUrl: string = await new Promise((resolve, reject) => {
			s3.getSignedUrl('putObject', params, function (err, data) {
				if (err) {
					return reject(err);
				}
				return resolve(data);
			});
		});
		return signedUrl;
	}

	async deleteFileOnS3(keys: any): Promise<string> {
		const params: any = {
			Bucket: config.aws.s3BucketName,
			Delete: {
				Objects: keys,
				Quiet: false
			}
		};
		s3.deleteObjects(params, function (err, data) {
			console.log("err, data", err, data)
			if (err) {
				logger.error(`Error in object deletion-${keys}`)
				return err;
			} else {
				return data;
			}
		});
		return;
	}
}

const imageHandler: ImageHandler = new ImageHandler();
export default imageHandler;
