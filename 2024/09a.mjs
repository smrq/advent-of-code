import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`2333133121414131402`), 1928
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let fwdI = 0;
	let fwdJ = 0;
	let fwdId = 0;
	let i = 0;

	let revI = input.length % 2 === 1 ? input.length - 1 : input.length - 2;
	let revJ = input[revI] - 1;
	let revId = Math.ceil(input.length / 2) - 1;

	let result = 0;

	while (fwdI < revI || fwdJ <= revJ) {
		if (fwdI % 2 === 0) {
			result += i * fwdId;
			fwdJ += 1;
			if (fwdJ >= input[fwdI]) {
				fwdI += 1;
				fwdJ = 0;
				fwdId += 1;
				if (input[fwdI] === 0) {
					fwdI += 1;
				}
			}
		} else {
			result += i * revId;
			
			fwdJ += 1;
			if (fwdJ >= input[fwdI]) {
				fwdI += 1;
				fwdJ = 0;
			}

			revJ -= 1;
			if (revJ < 0) {
				revI -= 2;
				revJ = input[revI] - 1;
				revId -= 1;
			}
		}
		i += 1;
	}

	return result;
}

function parseInput(str) {
	return str.trim().split('').map(x => parseInt(x, 10));
}
