const isConstructorProxyHandler = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	construct(): any {
		return Object.prototype;
	},
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
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