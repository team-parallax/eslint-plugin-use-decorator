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
	async someAsyncMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"public": true,
						},
					]
				}
			]
		},{
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
	async someAsyncMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"public": true,
						},
					]
				}
			]
		},
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
	async someAsyncMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert"
						},
					]
				}
			]
		},
		{
			code: `
class SomeClass {
	@assert
	private async somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
	someMethod(
		someParameter: number
	): number {
		return someParameter;
	}
	async someAsyncMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"private": true,
							"async": true
						},
					]
				}
			]
		},
		{
			code: `
class SomeClass {
	@assert
	static somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"static": true,
						},
					]
				}
			]
		},
		{
			code: `
class SomeClass {
	@assert
	private static async somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"static": true,
							"private": true,
							"async": true,
						},
					]
				}
			]
		},
		{
			code: `
class SomeClass {
	@assert
	private static async somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"private": true,
						},
					]
				}
			]
		},
		{
			code: `
class SomeClass {
	someMethod(
		@assertParameter someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [
						{
							"name": "assertParameter",
							"public": true
						}
					],
					methods: []
				}
			]
		},
		{
			code: `
class SomeClass {
	private static async someMethod(
		@assertParameter someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [
						{
							"name": "assertParameter",
							"private": true,
							"static": true,
							"async": true
						}
					],
					methods: []
				}
			]
		},
		{
			code: `
class SomeClass {
	@assert
	@errorcatch
	private static async someMethod(
		@assertParameter someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [
						{
							"name": "assertParameter",
							"private": true,
							"static": true,
							"async": true
						}
					],
					methods: [
						{
							"name": "assert",
							"private": true
						},
						{
							"name": "errorcatch",
							"private": true
						}
					]
				}
			]
		},
	],
	invalid: [
		{
			code: `
class SomeClass {
	somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"public": true,
						},
					]
				}
			],
			errors: [
				{
					messageId: "method",
					data: {
						decorator: "assert",
						types: "public"
					},
					line: 3,
					column: 2,
				},
			],
		},
		{
			code: `
class SomeClass {
	private static async somePrivateMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [],
					methods: [
						{
							"name": "assert",
							"private": true,
							"static": true,
							"async": true,
						},
					]
				}
			],
			errors: [
				{
					messageId: "method",
					data: {
						decorator: "assert",
						types: "private, static, async"
					},
					line: 3,
					column: 2,
				},
			],
		},

		{
			code: `
class SomeClass {
	private static async someMethod(
		someParameter: number
	): number {
		return someParameter;
	}
}
`,
			options: [
				{
					params: [
						{
							"name": "assertParameter",
							"private": true,
							"static": true,
							"async": true
						}
					],
					methods: [
						{
							"name": "assert",
							"private": true
						},
						{
							"name": "errorcatch",
							"private": true
						}
					]
				}
			],
			errors: [
				{
					messageId: "method",
					data: {
						decorator: "assert",
						types: "private"
					},
					line: 3,
					column: 2,
				},
				{
					messageId: "method",
					data: {
						decorator: "errorcatch",
						types: "private"
					},
					line: 3,
					column: 2,
				},
				{
					messageId: "param",
					data: {
						decorator: "assertParameter",
						types: "private, static, async"
					},
					line: 3,
					column: 2,
				},
			],
		},
	],
});