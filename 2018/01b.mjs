import fs from 'fs';
const freqs = fs.readFileSync('01.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(x => parseInt(x, 10));

let found = new Set();
found.add(0);

let freq = 0;
let i = 0;

while (true) {
	freq += freqs[i];
	i = (i + 1) % freqs.length;

	if (found.has(freq)) {
		console.log(freq);
		break;
	} else {
		found.add(freq);
	}
}
