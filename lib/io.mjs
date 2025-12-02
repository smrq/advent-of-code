import assert from 'assert';
import fs from 'fs';
import path from 'path';

export function D(...args) {
	// Log debug output to stderr so that stdout only contains the program result
	console.error(...args);
	return args[args.length-1];
}

export function getRawInput() {
	const inputFilename = process.argv[1].replace(/\D+\.mjs$/, '.txt');
	let input = fs.readFileSync(inputFilename, 'utf-8');
	if (/\n$/.test(input)) {
		input = input.replace(/\n+$/, '');
	}
	return input;
}

export function stringifyReplacer(key, value) {
	return typeof value === 'bigint' ? `BigInt(${value.toString()})` :
		value instanceof Set ? ['<Set>', ...value] :
		value instanceof Map ? ['<Map>', ...value.entries()] :
		value;
}

export async function runTests(f, tests) {
	assert.ok(tests.length % 2 === 0, 'Tests must be an interleaved array of inputs and outputs');
	for (let i = 0; i < tests.length; i += 2) {
		D(`[runTests] Running test on input ${JSON.stringify(tests[i], stringifyReplacer)}`);
		const input = tests[i];
		const expected = tests[i+1];
		const actual = await f(input);
		assert.deepStrictEqual(actual, expected);
		D(`[runTests] OK`);
	}
}

export function graphPoints(points) {
	const minX = Math.min(...points.map(pt => pt[0]));
	const maxX = Math.max(...points.map(pt => pt[0]));
	const minY = Math.min(...points.map(pt => pt[1]));
	const maxY = Math.max(...points.map(pt => pt[1]));

	for (let y = minY; y <= maxY; ++y) {
		for (let x = minX; x <= maxX; ++x) {
			if (points.some(d => d[0] === x && d[1] === y)) {
				process.stderr.write('#');
			} else {
				process.stderr.write(' ');
			}
		}
		process.stderr.write('\n');
	}
}
