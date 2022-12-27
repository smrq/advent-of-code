import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`), '2=-1=0'
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return encode(L.sum(input.map(decode)));
}

function parseInput(str) {
	return L.autoparse(str);
}

function encode(num) {
	let result = '';
	let carry = 0;
	while (num) {
		let digit = num % 5;
		num = Math.floor(num / 5);

		digit += carry;
		carry = 0;

		while (digit > 2) {
			digit -= 5;
			carry += 1;
		}

		result = (
			digit === -2 ? '=' :
			digit === -1 ? '-' :
			digit.toString(10)
		) + result;
	}
	if (carry) {
		result = String(carry) + result;
	}

	return result;
}

function decode(str) {
	let result = 0;
	for (let c of str.split('')) {
		result = 5 * result + (
			c === '=' ? -2 :
			c === '-' ? -1 :
			parseInt(c, 10)
		);
	}
	return result;
}
