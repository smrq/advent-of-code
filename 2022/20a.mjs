import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1
2
-3
3
-2
0
4`), 3
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const mixed = mix(input);
	const zeroIdx = mixed.indexOf(0);
	return mixed[(zeroIdx + 1000) % mixed.length] +
		mixed[(zeroIdx + 2000) % mixed.length] +
		mixed[(zeroIdx + 3000) % mixed.length];
}

function mix(arr) {
	const boxed = arr.map(value => ({ value }));
	const mixed = [...boxed];

	for (let box of boxed) {
		const idx = mixed.indexOf(box);
		mixed.splice(idx, 1);
		const newIdx = L.modulo(idx + box.value, mixed.length);
		mixed.splice(newIdx, 0, box);
	}

	return mixed.map(({ value }) => value);
}

function parseInput(str) {
	return L.autoparse(str);
}
