import { getRawInput, autoparse, sum, flatten } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run({ fields, ticket, nearby }) {
	const invalid = flatten(nearby.map(t => t.filter(n => ![...fields.values()].some(vs => isInRange(n, vs)))));
	return sum(invalid);

	function isInRange(n, vs) {
		return vs.some(v => n >= v[0] && n <= v[1]);
	}
}

function parseInput(str) {
	let [fields, ticket, nearby] = str.split('\n\n');

	fields = fields.split('\n')
		.map(line => line.split(': '))
		.map(([a, b]) => {
			b = b.split(' or ').map(c => c.split('-').map(d => parseInt(d, 10)));
			return [a, b];
		});
	fields = new Map(fields);

	ticket = autoparse(ticket.replace('your ticket:\n', ''));
	nearby = autoparse(nearby.replace('nearby tickets:\n', ''));

	return { fields, ticket, nearby };
}
