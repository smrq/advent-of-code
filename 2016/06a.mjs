import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
const input = fs.readFileSync('06.txt', 'utf-8').trim();
const tests = [
	['eedadn\ndrvtee\neandsr\nraavrd\natevrs\ntsrnev\nsdttsa\nrasrtv\nnssdts\nntnada\nsvetve\ntesnvt\nvntsnd\nvrdear\ndvrsen\nenarar', 'easter']
];

function run(input) {
	const lines = input.split('\n').map(line => line.split(''));
	return lines[0].map((_, i) => mostFrequent(lines.map(l => l[i])))
		.join('');
}

function mostFrequent(arr) {
	const elements = [...new Set(arr)];
	elements.sort((a, b) => count(arr, b) - count(arr, a));
	return elements[0];
}

function count(arr, e) {
	return arr.filter(x => x === e).length;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
