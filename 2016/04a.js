const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('04.txt', 'utf-8').trim();
const tests = [
	[`aaaaa-bbb-z-y-x-123[abxyz]\na-b-c-d-e-f-g-h-987[abcde]\nnot-a-real-room-404[oarel]\ntotally-real-room-200[decoy]`, 1514]
];

function run(input) {
	const rooms = input.split('\n').map(line => {
		const match = /([-\w]+)-(\d+)\[(\w+)\]/.exec(line);
		const [_, name, id, checksum] = match;
		return {
			name,
			id: +id,
			checksum,
			calculatedChecksum: calculateChecksum(name)
		};
	}).filter(x => x.checksum === x.calculatedChecksum);
	return rooms.reduce((acc, x) => acc + x.id, 0);
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

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
