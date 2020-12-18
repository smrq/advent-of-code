import { getRawInput, autoparse, runTests, sum } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
	[`1 + 2 * 3 + 4 * 5 + 6`], 71,
	[`2 * 3 + (4 * 5)`], 26,
	[`5 + (8 * 3 + 9 + 3 * 4 * 3)`], 437,
	[`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`], 12240,
	[`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`], 13632,
]);

console.log(run(input));

function run(input) {
	return sum(input.map(line => evalMath(line, 0)[1]));
}

function evalMath(str, i) {
	let currentOp = null;
	let currentVal = 0;
	for (; i < str.length; ++i) {
		const c = str[i];

		if (/[-+*/]/.test(c)) {
			currentOp = c;
		}
		else if (c === '(') {
			let subval;
			[i, subval] = evalMath(str, i+1);
			switch (currentOp) {
				case null:
					currentVal = subval; break;
				case '+':
					currentVal += subval; currentOp = null; break;
				case '-':
					currentVal -= subval; currentOp = null; break;
				case '*':
					currentVal *= subval; currentOp = null; break;
				case '/':
					currentVal /= subval; currentOp = null; break;
			}
		}
		else if (c === ')') {
			return [i, currentVal];
		}
		else if (/\d/.test(c)) {
			switch (currentOp) {
				case null:
					currentVal = +c; break;
				case '+':
					currentVal += +c; currentOp = null; break;
				case '-':
					currentVal -= +c; currentOp = null; break;
				case '*':
					currentVal *= +c; currentOp = null; break;
				case '/':
					currentVal /= +c; currentOp = null; break;
			}
		}
	}
	return [str.length, currentVal];
}

function parseInput(str) {
	return autoparse(str);
}
