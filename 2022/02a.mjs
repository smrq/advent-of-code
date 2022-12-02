import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`A Y
B X
C Z`), 15
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(scoreRound));
}

function parseInput(str) {
	return L.autoparse(str).map(([opponent, self]) => ({
		opponent: ({ 'A': 'rock', 'B': 'paper', 'C': 'scissors' })[opponent],
		self: ({ 'X': 'rock', 'Y': 'paper', 'Z': 'scissors' })[self],
	}));
}

function scoreRound({ self, opponent }) {
	const comparison = compare({ self, opponent });
	const result = ({ rock: 1, paper: 2, scissors: 3 })[self] +
		({ lose: 0, draw: 3, win: 6 })[comparison]
	return result;
}

function compare({ self, opponent }) {
	switch (self) {
		case 'rock':
			return ({ rock: 'draw', paper: 'lose', scissors: 'win' })[opponent];
		case 'paper':
			return ({ rock: 'win', paper: 'draw', scissors: 'lose' })[opponent];
		case 'scissors':
			return ({ rock: 'lose', paper: 'win', scissors: 'draw' })[opponent];
	}
}
