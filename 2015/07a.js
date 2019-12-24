const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname,
	path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function parseInput(input) {
	const rules = {};

	for (let line of input.split('\n')) {
		const [input, output] = line.split(' -> ');
		rules[output] = parseOperation(input);
	}

	return rules;
}

function parseOperation(operation) {
	const args = operation.split(' ');
	if (args.length === 1) {
		return { op: 'VALUE', a: args[0] };
	} else if (args.length === 2) {
		return { op: args[0], a: args[1] };
	} else {
		return { op: args[1], a: args[0], b: args[2] };
	}
}

function run(input) {
	const rules = parseInput(input);
	return evaluate(rules, 'a');
}

function evaluate(rules, name) {
	const evaluate = memo1(function (name) {
		if (/\d+/.test(name)) {
			return parseInt(name, 10);
		}

		const rule = rules[name];
		const a = rule.a && evaluate(rule.a);
		const b = rule.b && evaluate(rule.b);

		switch (rule.op) {
			case 'VALUE':
				return a;
			case 'AND':
				return a & b;
			case 'OR':
				return a | b;
			case 'NOT':
				return (~a) & 0xFFFF;
			case 'LSHIFT':
				return (a << b) & 0xFFFF;
			case 'RSHIFT':
				return a >> b;
			default:
				throw new Error(rule);
		}
	});

	return evaluate(name);
}

function memo1(fn) {
	const map = new Map();
	return arg => {
		if (!map.has(arg)) {
			map.set(arg, fn(arg));
		}
		return map.get(arg);
	}
}

console.log(run(input));