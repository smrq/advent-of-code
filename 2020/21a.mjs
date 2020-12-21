import { getRawInput, autoparse, runTests, sum, flatten, arrayIntersection, arrayDifference } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`), 5
]);

console.log(run(input));

function run(input) {
	const allAller = [...new Set(flatten(input.map(x => x.aller)))];
	const allIng = [...new Set(flatten(input.map(x => x.ing)))];

	const withoutAllers = allAller.map(aller => {
		const lines = input.filter(line => line.aller.includes(aller));
		const ings = arrayIntersection(...lines.map(x => x.ing));
		return arrayDifference(allIng, ings);
	});
	const safeIng = allIng.filter(x => withoutAllers.every(ls => ls.includes(x)));

	return sum(safeIng.map(ing => input.filter(line => line.ing.includes(ing)).length));
}

function parseInput(str) {
	return autoparse(str).map(line => {
		const [_, ing, aller] = /([\w ]+) \(contains ([\w, ]+)\)/.exec(line);
		return { ing: ing.split(' '), aller: aller.split(', ') };
	});
}
