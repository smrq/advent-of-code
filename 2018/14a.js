const fs = require('fs');
const input = +fs.readFileSync('14.txt', 'utf-8').trim();

const state = {
	board: [3, 7],
	ptr1: 0,
	ptr2: 1
};

console.log(run(state, input, 10));

function run(state, after, count) {
	while (state.board.length < count + after) {
		iterate();
	}
	return state.board.slice(after, count + after).join('');
}

function iterate() {
	const recipe1 = state.board[state.ptr1];
	const recipe2 = state.board[state.ptr2];
	const newRecipes = String(recipe1 + recipe2).split('').map(x => +x);
	state.board.push(...newRecipes);
	state.ptr1 = (state.ptr1 + 1 + state.board[state.ptr1]) % state.board.length;
	state.ptr2 = (state.ptr2 + 1 + state.board[state.ptr2]) % state.board.length;
}

function show({ board, ptr1, ptr2 }) {
	return board.map((x, i) => {
		if (i === ptr1 && i === ptr2) {
			return `!${x}!`;
		} else if (i === ptr1) {
			return `(${x})`;
		} else if (i === ptr2) {
			return `[${x}]`;
		} else {
			return ` ${x} `;
		}
	}).join('');
}