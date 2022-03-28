export default abstract class BaseError extends Error {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	constructor(message: string, error?: any) {
		super(message);
		this.cause = error;
		this.name = this.constructor.name;
	}
}