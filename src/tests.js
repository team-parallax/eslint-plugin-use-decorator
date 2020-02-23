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
class Formulas {
	static techPoints(
		baseChance: number,
		level: number,
		pointsMultiplier: number
	): number {
		return ((100 - baseChance) / 100) * level * pointsMultiplier;
	}
}
`,
			options: [
				{
					"params": [
						{
							"name": "assertParameter",
							"public": true
						}
					],
					"methods": [
						{
							"name": "assert",
							"public": true
						},
						{
							"name": "errorcatch",
							"async": true,
							"public": false
							/* TODO: check for async and public */
						}
					]
				}
			]
		}
	],
	invalid: [],
});