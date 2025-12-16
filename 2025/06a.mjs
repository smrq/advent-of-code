import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `), 4277556
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(({ ns, op }) =>
		ns.reduce((acc, n) => applyOperation(op, acc, n))
	));
}

function applyOperation(op, a, b) {
	switch (op) {
		case '+': return a + b;
		case '*': return a * b;
	}
}

function parseInput(str) {
	return L.transpose(str.split('\n').map(line => line.trim().split(/\s+/)))
		.map(line => {
			const op = line.pop();
			return { ns: line.map(n => parseInt(n, 10)), op };
		});
}

