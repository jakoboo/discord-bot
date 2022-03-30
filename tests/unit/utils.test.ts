import { isConstructor } from '../../src/utils/functions';

class FirstBaseClass {}
class FirstChildClass extends FirstBaseClass {}

class SecondBaseClass {}
class SecondChildClass extends SecondBaseClass {}

describe('.isConstructor', () => {
	test('should return truthy value if passed parameter match a parent class constructor', () => {
		expect(isConstructor(FirstChildClass, FirstBaseClass)).toBeTruthy();
		expect(isConstructor(SecondChildClass, SecondBaseClass)).toBeTruthy();
	});

	test('should return falsy value if passed parameter does not match a parent class constructor', () => {
		expect(isConstructor(FirstChildClass, SecondBaseClass)).toBeFalsy();
		expect(isConstructor(SecondChildClass, FirstBaseClass)).toBeFalsy();
	});

	test('should return falsy if passed parameter is not a constructor', () => {
		expect(isConstructor(new FirstChildClass(), FirstBaseClass)).toBeFalsy();
		expect(isConstructor(new FirstChildClass(), FirstChildClass)).toBeFalsy();

		expect(isConstructor(new SecondChildClass(), FirstBaseClass)).toBeFalsy();
		expect(isConstructor(new SecondChildClass(), SecondChildClass)).toBeFalsy();
	});

	test('should return truthy if passed parameter is a constructor and no class has been specified', () => {
		expect(isConstructor(FirstBaseClass, null)).toBeTruthy();
		expect(isConstructor(FirstChildClass, null)).toBeTruthy();

		expect(isConstructor(SecondBaseClass, null)).toBeTruthy();
		expect(isConstructor(SecondChildClass, null)).toBeTruthy();

		expect(isConstructor(new FirstChildClass(), null)).toBeFalsy();
		expect(isConstructor(new FirstChildClass(), null)).toBeFalsy();
	});
});