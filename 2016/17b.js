const assert = require('assert');
const chalk = require('chalk');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [
	['ihgpwlah', 370],
	['kglvqrro', 492],
	['ulqzkmiv', 830],
];

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

function longestPath({ start, isGoal, neighbors }) {
	let longest = '';

	const openSet = [start];
	while (openSet.length) {
		const current = openSet.pop();
		if (isGoal(current)) {
			if (current.path.length > longest.length) {
				longest = current.path;
			}
		} else {
			for (let neighbor of neighbors(current)) {
				openSet.push(neighbor);
			}
		}
	}

	return longest;
}

function run(input) {
	const start = { path: '', x: 0, y: 0 };
	return longestPath({ start, isGoal, neighbors }).length;

	function isGoal(state) {
		return state.x === 3 && state.y === 3;
	}

	function neighbors(state) {
		const result = [];
		const doorHash = md5(input + state.path);
		if (state.y > 0) {
			if (/[bcdef]/.test(doorHash[0])) {
				result.push({
					path: state.path + 'U',
					x: state.x,
					y: state.y - 1
				});
			}
		}
		if (state.y < 3) {
			if (/[bcdef]/.test(doorHash[1])) {
				result.push({
					path: state.path + 'D',
					x: state.x,
					y: state.y + 1
				});
			}
		}
		if (state.x > 0) {
			if (/[bcdef]/.test(doorHash[2])) {
				result.push({
					path: state.path + 'L',
					x: state.x - 1,
					y: state.y
				});
			}
		}
		if (state.x < 3) {
			if (/[bcdef]/.test(doorHash[3])) {
				result.push({
					path: state.path + 'R',
					x: state.x + 1,
					y: state.y
				});
			}
		}
		return result;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
