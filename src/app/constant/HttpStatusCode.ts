export default class HttpStatusCode {
	constructor () {}
	public static HTTP_SUCCESS_OK = 200;
	public static HTTP_CREATED = 201;
	public static HTTP_NO_CONTENT = 204;
	public static HTTP_BAD_REQUEST = 400;
	public static HTTP_UNAUTHORIZED = 401;
	public static HTTP_FORBIDDEN = 403;
	public static HTTP_CONFLICT = 409;
	public static HTTP_UNPROCESSABLE_ENTITY = 422;
	public static HTTP_REQUESTED_RESOURCE_NOT_FOUND = 404;
	public static HTTP_PRECONDITION_FAILED = 412;
	public static HTTP_INTERNAL_SERVER_ERROR = 500;
}
