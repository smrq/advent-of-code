const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = [fs.readFileSync(inputFilename, 'utf-8').trim(), 'abcdefgh'];
const tests = [
	[[`swap position 4 with position 0\nswap letter d with letter b\nreverse positions 0 through 4\nrotate left 1 step\nmove position 1 to position 4\nmove position 3 to position 0\nrotate based on position of letter b\nrotate based on position of letter d`, 'abcde'], 'decab']
];

function run([input, password]) {
	password = password.split('');
	for (let instruction of input.split('\n')) {
		password = applyInstruction(instruction, password);
	}
	return password.join('');
}

function applyInstruction(instruction, password) {
	let match;
	if (match = /swap position (\d+) with position (\d+)/.exec(instruction)) {
		return swap(password, +match[1], +match[2]);
	} else if (match = /swap letter (\w) with letter (\w)/.exec(instruction)) {
		const i = password.indexOf(match[1]);
		const j = password.indexOf(match[2]);
		return swap(password, i, j);
	} else if (match = /rotate (left|right) (\d+) steps?/.exec(instruction)) {
		if (match[1] === 'left') {
			return rotateLeft(password, +match[2]);
		} else {
			return rotateRight(password, +match[2]);
		}
	} else if (match = /rotate based on position of letter (\w)/.exec(instruction)) {
		const n = password.indexOf(match[1]);
		return rotateRight(password, n + 1 + (n >= 4 ? 1 : 0));
	} else if (match = /reverse positions (\d+) through (\d+)/.exec(instruction)) {
		return reverseSpan(password, +match[1], +match[2])
	} else if (match = /move position (\d+) to position (\d+)/.exec(instruction)) {
		return move(password, +match[1], +match[2]);
	} else {
		throw new Error(instruction);
	}
}

function swap(password, i, j) {
	const tmp = password[i];
	password[i] = password[j];
	password[j] = tmp;
	return password;
}

function rotateLeft(password, n) {
	n = n % password.length;
	return [
		...password.slice(n),
		...password.slice(0, n)
	];
}

function rotateRight(password, n) {
	n = n % password.length;
	return [
		...password.slice(-n),
		...password.slice(0, -n)
	];
}

function reverseSpan(password, i, j) {
	return [
		...password.slice(0, i),
		...password.slice(i, j+1).reverse(),
		...password.slice(j+1)
	];
}

function move(password, i, j) {
	const c = password.splice(i, 1);
	password.splice(j, 0, c[0]);
	return password;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
