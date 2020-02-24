/* eslint-disable */
const getDecoratorName = decorator => decorator
	&& decorator.expression
	&& (decorator.expression.callee
		&& decorator.expression.callee.name
		|| decorator.expression.name);
const shouldCheckRule = node => item => {
	const isPrivate = item.private;
	const isPublic = item.public;
	const isAsync = item.async;
	const isStatic = item.static;
	const solution = getSolution(isPrivate, isPublic, isAsync, isStatic);
	const test = Number(shouldCheckRulePrivate(node, isPrivate)) * binaryFactors.isPrivate
		+ Number(shouldCheckRulePublic(node, isPublic)) * binaryFactors.isPublic
		+ Number(shouldCheckRuleAsync(node, isAsync)) * binaryFactors.isAsync
		+ Number(shouldCheckRuleStatic(node, isStatic)) * binaryFactors.isStatic;
	/* https://stackoverflow.com/a/21257341/3143953 */
	return (test & solution) === solution;
};
const binaryFactors = {
	isPrivate: 1,
	isPublic: 2,
	isAsync: 4,
	isStatic: 8,
};
const defaultOption = {
	isPrivate: false,
	isPublic: false,
	isAsync: false,
	isStatic: false,
};
const getSolution = (isPrivate, isPublic, isAsync, isStatic) => {
	const privateFactor = (typeof isPrivate === "undefined"
		? Number(defaultOption.isPrivate)
		: Number(isPrivate)) * binaryFactors.isPrivate;
	const publicFactor = (typeof isPublic === "undefined"
		? Number(defaultOption.isPublic)
		: Number(isPublic)) * binaryFactors.isPublic;
	const asyncFactor = (typeof isAsync === "undefined"
		? Number(defaultOption.isAsync)
		: Number(isAsync)) * binaryFactors.isAsync;
	const staticFactor = (typeof isStatic === "undefined"
		? Number(defaultOption.isStatic)
		: Number(isStatic)) * binaryFactors.isStatic;
	return privateFactor + publicFactor + asyncFactor + staticFactor
};
const getName = item => item.name;
const shouldCheckRuleStatic = (node, isStatic) => {
	if(typeof isStatic === "undefined") {
		return defaultOption.isStatic;
	}
	else if(isStatic && node.static) {
		return true;
	}
	else return !isStatic && !node.static;
};
const shouldCheckRuleAsync = (node, isAsync) => {
	if(typeof isAsync === "undefined") {
		return defaultOption.isAsync;
	}
	else if(isAsync && node.value.async) {
		return true;
	}
	else return !isAsync && !node.value.async;
};
const shouldCheckRulePublic = (node, isPublic) => {
	if(typeof isPublic === "undefined") {
		return defaultOption.isPublic;
	}
	return (!isPublic && (!node.hasOwnProperty("accessibility") || node.accessibility !== "private"))
	|| (isPublic && node.hasOwnProperty("accessibility") && node.accessibility !== "private")
	|| (isPublic && typeof node.accessibility === "undefined")
};
const shouldCheckRulePrivate = (node, isPrivate) => {
	if(typeof isPrivate === "undefined") {
		return defaultOption.isPrivate;
	}
	return (!isPrivate && (!node.hasOwnProperty("accessibility") || node.accessibility !== "private"))
		|| (isPrivate && node.hasOwnProperty("accessibility") && node.accessibility === "private");
};
const getMissingMethodDecoratorsSingle = (necessaryMethodDecorators, node) => {
	if(node.decorators) {
		for (const decorator of node.decorators) {
			const methodName = getDecoratorName(decorator);
			necessaryMethodDecorators = necessaryMethodDecorators.filter(item => item.name !== methodName);
		}
	}
	return necessaryMethodDecorators;
};
const getMissingMethodDecorators = (necessaryMethodDecorators = [], node) => {
	const necessaryMethodDecoratorsFiltered = necessaryMethodDecorators
		.filter(shouldCheckRule(node));
	return getMissingMethodDecoratorsSingle(
		necessaryMethodDecoratorsFiltered,
		node);
};
const getMissingParamDecoratorsSingle = (necessaryParamDecorators, node) => {
	const missingParamDecorator = [];
	if(node.value && node.value.params) {
		for(const param of node.value.params) {
			const decorators = param.decorators;
			let necessaryParamDecoratorsPerParam = [...necessaryParamDecorators];
			if(decorators) {
				for(const decorator of decorators) {
					const paramName = getDecoratorName(decorator);
					necessaryParamDecoratorsPerParam = necessaryParamDecoratorsPerParam.filter(item => item.name !== paramName);
				}
			}
			missingParamDecorator.push(...necessaryParamDecoratorsPerParam);
		}
	}
	return missingParamDecorator;
};
const getMissingParamDecorators = (necessaryParamDecorators = [], node) => {
	const necessaryParamDecoratorsFiltered = necessaryParamDecorators
		.filter(shouldCheckRule(node));
	return getMissingParamDecoratorsSingle(
		necessaryParamDecoratorsFiltered,
		node);
};
module.exports.rules = {
	"use-decorator": {
		name: "use-decorator",
		meta: {
			type: "suggestion",
			docs: {
				description: "Enforce custom-decorators",
				recommended: "error"
			},
			messages: {
				method: "'{{decorator}}'-decorator is missing for {{types}} method.",
				param: "'{{decorator}}'-decorator is missing for param of {{types}} method.",
			}
		},
		create: context => {
			const options = context.options[0] || {};
			const {
				params: necessaryParamDecorators,
				methods: necessaryMethodDecorators
			} = options;
			return {
				MethodDefinition(node) {
					/* method */
					const missingDecorators = getMissingMethodDecorators(necessaryMethodDecorators, node);
					for (const missingDecorator of missingDecorators) {
						context.report({
							node,
							messageId: "method",
							data: {
								decorator: missingDecorator.name,
								types: Object.keys(missingDecorator).filter(key => key !== "name").join(", ")
							}
						});
					}
					/* params */
					const missingParamDecorator = getMissingParamDecorators(necessaryParamDecorators, node);
					for(const paramName of missingParamDecorator) {
						context.report({
							node,
							messageId: "param",
							data: {
								decorator: paramName.name,
								types: Object.keys(paramName).filter(key => key !== "name").join(", ")
							}
						});
					}
				},
			};
		}
	}
};