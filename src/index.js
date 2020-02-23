/* eslint-disable */
const getDecoratorName = decorator => decorator
	&& decorator.expression
	&& (decorator.expression.callee
		&& decorator.expression.callee.name
		|| decorator.expression.name);
const shouldCheckHoF = node => {
	return item => {
		const isPrivate = item.private;
		const isPublic = item.public;
		const isAsync = item.async;
		const solution = getSolution(isPrivate, isPublic, isAsync);
		const test = Number(shouldCheckPrivate(node, isPrivate))
			+ Number(shouldCheckPublic(node, isPublic)) * 2
			+ Number(shouldCheckAsync(node, isAsync)) * 4;
		/* https://stackoverflow.com/a/21257341/3143953 */
		console.log(solution, test, solution & test);
		return (solution & test) === solution;
	}
};
const getSolution = (isPrivate, isPublic, isAsync) => {
	const privateFactor = typeof isPrivate === "undefined" ? 1 : Number(isPrivate);
	const publicFactor = (typeof isPublic === "undefined" ? 1 : Number(isPublic)) * 2;
	const asyncFactor = (typeof isAsync === "undefined" ? 1 : Number(isAsync)) * 4;
	return privateFactor + publicFactor + asyncFactor
};
const getName = item => item.name;
const shouldCheckAsync = (node, isAsync) => {
	if(typeof isAsync === "undefined") {
		return true;
	}
	else if(isAsync && node.value.async) {
		return true;
	}
	else return !isAsync && !node.value.async;
};
const shouldCheckPublic = (node, isPublic) => {
	if(typeof isPublic === "undefined") {
		return true;
	}
	return (!isPublic && (!node.hasOwnProperty("accessibility") || node.accessibility !== "private"))
	|| (isPublic && node.hasOwnProperty("accessibility") && node.accessibility !== "private");
};
const shouldCheckPrivate = (node, isPrivate) => {
	if(typeof isPrivate === "undefined") {
		return true;
	}
	return (!isPrivate && (!node.hasOwnProperty("accessibility") || node.accessibility !== "private"))
		|| (isPrivate && node.hasOwnProperty("accessibility") && node.accessibility === "private");
};
const getMissingMethodDecoratorsSingle = (necessaryMethodDecorators, node) => {
	if(node.decorators) {
		for (const decorator of node.decorators) {
			const methodName = getDecoratorName(decorator);
			if (necessaryMethodDecorators.includes(methodName)) {
				necessaryMethodDecorators.splice(necessaryMethodDecorators.indexOf(methodName), 1);
			}
		}
	}
	return necessaryMethodDecorators;
};
const getMissingMethodDecorators = (necessaryMethodDecorators = [], node) => {
	const necessaryMethodDecoratorsFiltered = necessaryMethodDecorators
		.filter(shouldCheckHoF(node))
		.map(getName);
	return getMissingMethodDecoratorsSingle(
		necessaryMethodDecoratorsFiltered,
		node);
};
const getMissingParamDecoratorsSingle = (necessaryParamDecorators, node) => {
	const missingParamDecorator = [];
	if(node.value && node.value.params) {
		for(const param of node.value.params) {
			const decorators = param.decorators;
			const necessaryParamDecoratorsPerParam = [...necessaryParamDecorators];
			if(decorators) {
				for(const decorator of decorators) {
					const paramName = getDecoratorName(decorator);
					if(necessaryParamDecoratorsPerParam.includes(paramName)) {
						necessaryParamDecoratorsPerParam.splice(necessaryParamDecoratorsPerParam.indexOf(paramName), 1);
					}
				}
			}
			for(const paramName of necessaryParamDecoratorsPerParam) {
				missingParamDecorator.push(paramName);
			}
		}
	}
	return missingParamDecorator;
};
const getMissingParamDecorators = (necessaryParamDecorators = [], node) => {
	const necessaryParamDecoratorsFiltered = necessaryParamDecorators
		.filter(shouldCheckHoF(node))
		.map(getName);
	return getMissingParamDecoratorsSingle(
		necessaryParamDecoratorsFiltered,
		node);
};
module.exports.rules = {
	"use-assert-decorator": context => {
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
					context.report(node, `"${ missingDecorator }"-decorator is missing`);
				}
				/* params */
				const missingParamDecorator = getMissingParamDecorators(necessaryParamDecorators, node);
				for(const paramName of missingParamDecorator) {
					context.report(node, `"${paramName}"-decorator is missing`);
				}
			},
//			Identifier(node) {
//				if(node.parent.type === "FunctionExpression") {
//					console.log("Parameter", node);
//					console.log(node.parent);
//					console.log(node.decorators);
//					context.report(node, 'Parameter');
//				}
//			}
		};
	}
};