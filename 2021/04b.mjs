import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());

L.runTests(args => run(args), [
	parseInput(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`), 1924
]);

console.log(run(input));

function run([numbers, boards]) {
	let remaining = boards;
	for (let i = 0; i < numbers.length; ++i) {
		const called = numbers.slice(0, i);
		if (remaining.length > 1) {
			remaining = remaining.filter(board => !isWinner(board, called));
		} else {
			const board = remaining[0];
			if (isWinner(board, called)) {
				return score(board, called);
			}
		}
	}
	return false;
}

function isWinner(board, numbers) {
	const marked = board.map(line => line.map(x => numbers.includes(x)));
	for (let i = 0; i < 5; ++i) {
		if (marked[i].every(x => x)) {
			return true;
		}
		if (marked.every(row => row[i])) {
			return true;
		}
	}
	return false;
}

function score(board, numbers) {
	const sum = L.sum(L.flatten(board).filter(x => !numbers.includes(x)));
	return sum * numbers[numbers.length-1];
}

function parseInput(str) {
	const [a, ...b] = str.split('\n\n');
	return [
		L.autoparse(a),
		L.autoparse(b.join('\n\n'))
	];
}
