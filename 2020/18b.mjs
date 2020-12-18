import { getRawInput, autoparse, runTests, sum } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
	[`1 + 2 * 3 + 4 * 5 + 6`], 231,
]);

console.log(run(input));

function run(input) {
	return sum(input.map(line => evalMath(line)));
}

function evalMath(str) {
	const parsed = parseMath(str);

	let stack = [];
	for (let token of parsed) {
		if (/\d/.test(token)) {
			stack.push(+token);
		} else if (token === '+') {
			stack.push(stack.pop() + stack.pop());
		} else if (token === '*') {
			stack.push(stack.pop() * stack.pop());
		}
	}
	return stack.pop();
}

function parseMath(str) {
	let precedence = {
		'(': 2,
		'+': 1,
		'*': 0,
	};

	let out = [];
	let opstack = [];

	for (let c of str.split('')) {
		if (/\d/.test(c)) {
			out.push(c);
		}
		else if (/[-+*/]/.test(c)) {
			while (opstack.length &&
				precedence[opstack[opstack.length-1]] > precedence[c] &&
				opstack[opstack.length-1] !== '('
			) {
				out.push(opstack.pop());
			}
			opstack.push(c);
		}
		else if (c === '(') {
			opstack.push(c);
		}
		else if (c === ')') {
			for (;;) {
				if (!opstack.length) throw new Error('mismatched parens');
				const op = opstack.pop();
				if (op === '(') {
					break;
				}
				out.push(op);
			}
		}
	}

	while (opstack.length) {
		out.push(opstack.pop());
	}

	return out;
}

function parseInput(str) {
	return autoparse(str);
}
