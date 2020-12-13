import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { getRawInput } from '../lib.mjs';
const input = [getRawInput(), 'fbgdceah'];
const tests = [];

function run([input, password]) {
	const originalPassword = password;

	password = password.split('');
	for (let instruction of input.split('\n').reverse()) {
		const original = password.join('');
		password = applyReverseInstruction(instruction, password);
		const verify = applyInstruction(instruction, password).join('');
		assert.strictEqual(original, verify, instruction);
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

function applyReverseInstruction(instruction, password) {
	let match;
	if (match = /swap position (\d+) with position (\d+)/.exec(instruction)) {
		return swap(password, +match[1], +match[2]);
	} else if (match = /swap letter (\w) with letter (\w)/.exec(instruction)) {
		const i = password.indexOf(match[1]);
		const j = password.indexOf(match[2]);
		return swap(password, i, j);
	} else if (match = /rotate (left|right) (\d+) steps?/.exec(instruction)) {
		if (match[1] === 'left') {
			return rotateRight(password, +match[2]);
		} else {
			return rotateLeft(password, +match[2]);
		}
	} else if (match = /rotate based on position of letter (\w)/.exec(instruction)) {
		let i = password.indexOf(match[1]);
		let j = -1;

		while (i !== j) {
			password = rotateLeft(password, 1);
			i = (i - 1 + password.length) % password.length;
			++j;

			if (j === 4) {
				password = rotateLeft(password, 1);
				i = (i - 1 + password.length) % password.length;
			}
		}
		
		return password;
	} else if (match = /reverse positions (\d+) through (\d+)/.exec(instruction)) {
		return reverseSpan(password, +match[1], +match[2])
	} else if (match = /move position (\d+) to position (\d+)/.exec(instruction)) {
		return move(password, +match[2], +match[1]);
	} else {
		throw new Error(instruction);
	}
}

function swap(password, i, j) {
	password = [...password];
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
	password = [...password];
	const c = password.splice(i, 1);
	password.splice(j, 0, c[0]);
	return password;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
