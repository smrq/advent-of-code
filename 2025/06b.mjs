import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `), 3263827
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
	let result = [];
	
	const lines = str.split('\n');
	const ops = lines.pop().trim().split(/\s+/);

	const transposed = L.transpose(lines).map(line => line.join('').trim());

	while (transposed.length) {
		const problem = { op: ops.pop(), ns: [] };
		let n;
		while (transposed.length) {
			n = transposed.pop();
			if (n !== '') {
				problem.ns.push(parseInt(n, 10));
			} else {
				break;
			}
		}
		result.push(problem);
	}
	return result;
}

