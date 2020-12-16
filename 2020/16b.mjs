import { getRawInput, autoparse, zip, product } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run({ fields, ticket, nearby }) {
	const valid = [
		...nearby.filter(isValidTicket),
		ticket
	];
	const values = zip(...valid);

	let unassigned = new Set(fields.keys());
	let assigned = new Map();

	while (unassigned.size) {
		for (let i = 0; i < values.length; ++i) {
			const candidates = [...unassigned].filter(k => {
				return values[i].every(n => isInRange(n, fields.get(k)))
			});
			if (candidates.length === 1) {
				unassigned.delete(candidates[0]);
				assigned.set(candidates[0], i);
				break;
			}
		}
	}

	return product(
		[...fields.keys()]
			.filter(k => /^departure/.test(k))
			.map(k => ticket[assigned.get(k)])
	);

	function isValidTicket(t) {
		return t.every(n => {
			for (let vs of fields.values()) {
				if (isInRange(n, vs)) return true;
			}
			return false;
		});
	}

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
