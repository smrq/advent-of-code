import { getRawInput, autoparse, runTests } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
	parseInput('389125467'), '67384529'
]);

console.log(run(input));

function run(input) {
	const minval = Math.min(...input);
	const maxval = Math.max(...input);

	for (let i = 0; i < 100; ++i) {
		const picked = input.splice(1, 3);
		
		let dest = input[0];
		do {
			--dest;
			if (dest < minval) dest = maxval;
		}
		while (picked.includes(dest));

		const destIndex = input.indexOf(dest);
		input.splice(destIndex+1, 0, ...picked);
		input.push(input.shift());
	}

	while (input[0] !== 1) {
		input.push(input.shift());
	}

	return input.slice(1).join('');
}

function parseInput(str) {
	return str.split('').map(x => +x)
}
