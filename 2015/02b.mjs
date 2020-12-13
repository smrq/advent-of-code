import fs from 'fs';
const input = fs.readFileSync('02.txt', 'utf-8').trim();

function run(input) {
	return input.split('\n').map(line => {
		const [l, w, h] = line.split('x').map(n => +n);

		return 2 * (l+w+h-Math.max(l, w, h)) + l*w*h;
	}).reduce((a, b) => a + b);
}

console.log(run(input));