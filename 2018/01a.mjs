import fs from 'fs';
const freqs = fs.readFileSync('01.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(x => parseInt(x, 10));
const result = freqs.reduce((a, b) => a + b, 0);
console.log(result);