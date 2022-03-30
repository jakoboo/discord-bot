export default abstract class BaseError extends Error {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	constructor(message: string, options?: Record<string, unknown>) {
		super(message, options);
		this.name = this.constructor.name;
	}
}