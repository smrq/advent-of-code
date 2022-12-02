import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`A Y
B X
C Z`), 12
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(scoreRound));
}

function parseInput(str) {
	return L.autoparse(str).map(([opponent, comparison]) => ({
		opponent: ({ 'A': 'rock', 'B': 'paper', 'C': 'scissors' })[opponent],
		comparison: ({ 'X': 'lose', 'Y': 'draw', 'Z': 'win' })[comparison],
	}));
}

function scoreRound({ opponent, comparison }) {
	const self = determine({ opponent, comparison });
	const result = ({ rock: 1, paper: 2, scissors: 3 })[self] +
		({ lose: 0, draw: 3, win: 6 })[comparison]
	return result;
}

function determine({ opponent, comparison }) {
	switch (opponent) {
		case 'rock':
			return ({ win: 'paper', draw: 'rock', lose: 'scissors' })[comparison];
		case 'paper':
			return ({ win: 'scissors', draw: 'paper', lose: 'rock' })[comparison];
		case 'scissors':
			return ({ win: 'rock', draw: 'scissors', lose: 'paper' })[comparison];
	}
}
