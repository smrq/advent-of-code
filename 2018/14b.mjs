import fs from 'fs';
const input = fs.readFileSync('14.txt', 'utf-8').trim();

const state = {
	board: [3, 7],
	ptr1: 0,
	ptr2: 1,
	checkedUntil: 0
};

console.log(run(state, input));

function run(state, needle) {
	while (true) {
		iterate();
		for (let n = state.checkedUntil; n < state.board.length; ++n) {
			if (n - needle.length < 0) continue;
			const recipes = state.board.slice(n - needle.length, n).join('');
			if (recipes === needle) {
				return n - needle.length;
			}
		}
		state.checkedUntil = state.board.length;
	}
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