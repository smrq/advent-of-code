import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`), 8
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function isImpossible(set) {
	if ((set.get('red') ?? 0) > 12) return true;
	if ((set.get('green') ?? 0) > 13) return true;
	if ((set.get('blue') ?? 0) > 14) return true;
	return false;
}

function run(input) {
	let result = 0;

	for (let { id, sets } of input) {
		if (!sets.some(set => isImpossible(set))) {
			result += id;
		}
	}

	return result;
}

function parseInput(str) {
	return L.autoparse(str).map(line => {
		let [, id, sets] = /Game (\d+): (.*)/.exec(line);
		sets = sets.split('; ').map(set => {
			let obj = new Map();
			for (let pair of set.split(', ')) {
				let [n, color] = pair.split(' ');
				obj.set(color, +n);
			}
			return obj;
		});
		return { id: +id, sets };
	});
}
