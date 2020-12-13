import fs from 'fs';
const input = fs.readFileSync('04.txt', 'utf-8').trim();

function run(input) {
	return input.split('\n').filter(line => {
		const values = line.split(' ');
		const set = new Set();
		for (let value of values) {
			if (set.has(value)) return false;
			set.add(value);
		}
		return true;
	}).length;
}

console.log(run(input));
