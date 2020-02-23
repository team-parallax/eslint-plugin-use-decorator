const { rules } = require("./index");
const { RuleTester } = require('@typescript-eslint/experimental-utils/dist/ts-eslint/RuleTester');
const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {},
	},
	parser: require.resolve('@typescript-eslint/parser'),
});
ruleTester.run('use-assert-decorator', rules["use-assert-decorator"], {
	valid: [
		{
			code: `
class SomeClass {
	@assert
	private somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
	@assert
	someMethod(
		someParameter: number
	): number {
		return someParameter;
	}
	@assert
	async someMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					"params": [],
					"methods": [
						{
							"name": "assert",
							"private": true,
							"public": true,
							"async": true
						},
					]
				}
			]
		}
	],
	invalid: [],
});