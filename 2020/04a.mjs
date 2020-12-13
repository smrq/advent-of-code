import { getRawInput } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	return input.filter(passport => {
		const fields = passport.map(x => x[0]);
		return ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
			.every(f => fields.includes(f));
	}).length;
}

function parseInput(str) {
	return str.split('\n\n').map(block => {
		return block.split(/[\n ]/g).map(x => x.split(':'))
	});
}
