import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`), 1320,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function hash(str) {
	let value = 0;
	for (let i = 0; i < str.length; ++i) {
		value += str.charCodeAt(i);
		value *= 17;
		value = value % 256;
	}
	return value;
}

function run(input) {
	return L.sum(input.map(hash));
}

function parseInput(str) {
	return str.trim().split(',');
}
