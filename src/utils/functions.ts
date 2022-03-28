const isConstructorProxyHandler = {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	construct() {
		return Object.prototype;
	},
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isConstructor(func: any, _class: any): boolean {
	try {
		new new Proxy(func, isConstructorProxyHandler)();
		if (!_class) return true;
		return func.prototype instanceof _class;
	}
	catch (err) {
		return false;
	}
}