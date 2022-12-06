import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`), 'CMZ'
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run({ crates, procedure }) {
	for (let { qty, src, dest } of procedure) {
		for (let i = 0; i < qty; ++i) {
			crates[dest].push(crates[src].pop());
		}
	}
	return crates.slice(1).map(stack => stack[stack.length - 1]).join('');
}

function parseInput(str) {
	const [crates, procedure] = L.autoparse(str);
	return {
		crates: parseCrates(crates),
		procedure: parseProcedure(procedure)
	};
}

function parseCrates(arr) {
	const labels = arr.pop();
	const result = [];
	for (let n = 1; ; ++n) {
		const i = labels.indexOf(n);
		if (i === -1) break;
		result[n] = arr.map(line => line[i])
			.reverse()
			.filter(x => /[A-Z]/.test(x));
	}
	return result;
}

function parseProcedure(arr) {
	return arr.map(line => {
		const [qty, src, dest] = /move (\d+) from (\d+) to (\d+)/.exec(line)
			.slice(1)
			.map(x => parseInt(x, 10));
		return { qty, src, dest };
	});
}