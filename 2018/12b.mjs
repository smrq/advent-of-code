import fs from 'fs';
const raw = fs.readFileSync('12.txt', 'utf-8')
	.trim()
	.split('\n');

const initialState = /initial state: (.*)/.exec(raw[0])[1];
const rules = raw.slice(2).map(str => {
	const [_, input, output] = /([.#]{5}) => ([.#])/.exec(str);
	return { input, output };
}).reduce((acc, rule) => {
	acc[rule.input] = rule.output;
	return acc;
}, {});

console.log(calculateScoreAfterGenerations(initialState, 50000000000));

function calculateScoreAfterGenerations(initialState, g) {
	let state = initialState.split('').reduce((acc, x, i) => { acc[i] = x; return acc; }, {});
	state.min = 0;
	state.max = initialState.length - 1;
	let generation = 0;
	let score = calculateScore(state);
	let scoreDiff;

	while (true) {
		const newState = run(state, rules);
		const newScore = calculateScore(newState);
		const newScoreDiff = newScore - score;

		if (newScoreDiff === scoreDiff) {
			break;
		}

		state = newState;
		score = newScore;
		scoreDiff = newScoreDiff;
		++generation;

		console.log(`${generation}: ${score} (${scoreDiff})`);
	}

	return score + (g - generation) * scoreDiff;
}

function calculateScore(state) {
	let result = 0;
	for (let n = state.min; n <= state.max; ++n) {
		if (state[n] === '#') {
			result += n;
		}
	}
	return result;
}

function run(state, rules) {
	const newState = { min: state.min, max: state.max };
	for (let n = state.min - 2; n <= state.max + 2; ++n) {
		const input = r(n-2) + r(n-1) + r(n) + r(n+1) + r(n+2);
		const output = rules[input] || '.';
		newState[n] = output;
		if (output === '#') {
			if (n < state.min) {
				newState.min = n;
			} else if (n > state.max) {
				newState.max = n;
			}
		}
	}

	return newState;

	function r(n) {
		return state[n] || '.';
	}
}


function show(state) {
	let result = '';
	for (let n = state.min; n <= state.max; ++n) {
		const value = state[n] || '.';
		if (n === 0) {
			result += `|${value}`;
		} else {
			result += value;
		}
	}
	return result;
}