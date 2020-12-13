import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('04.txt', 'utf-8').trim();
const tests = [];

function run(input) {
	const rooms = input.split('\n').map(line => {
		const match = /([-\w]+)-(\d+)\[(\w+)\]/.exec(line);
		let [_, name, id, checksum] = match;
		id = +id;

		const calculated = calculateChecksum(name);
		if (calculated !== checksum) {
			return null;
		}

		name = shift(name, id);
		return { id, name };
	}).filter(x => x);

	return rooms.find(r => /object storage/.test(r.name));
}

function calculateChecksum(name) {
	return unique(name.replace(/-/g, '').split(''))
		.sort((a, b) => (countCharacters(name, b) - countCharacters(name, a)) ||
			a.localeCompare(b))
		.slice(0, 5)
		.join('');
}

function countCharacters(str, c) {
	return str.split(c).length - 1;
}

function unique(arr) {
	return [...new Set(arr)];
}

function shift(name, n) {
	return name
		.replace(/\w/g, c =>
			String.fromCharCode(
				(c.charCodeAt(0) - 'a'.charCodeAt(0) + n) % 26 +
				'a'.charCodeAt(0)))
		.replace(/-/g, ' ');
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
