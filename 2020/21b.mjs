import { getRawInput, autoparse, runTests, flatten, arrayIntersection, arrayDifference } from '../lib.mjs';

const input = parseInput(getRawInput());

runTests(args => run(args), [
parseInput(`mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`), 'mxmxvkd,sqjhc,fvjkl'
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

	const remainingIng = new Set(arrayDifference(allIng, safeIng));
	const remainingAller = new Set(allAller);
	const allocated = new Map();

	while (remainingAller.size) {
		for (let aller of remainingAller) {
			const lines = input.filter(line => line.aller.includes(aller));
			const ings = arrayIntersection([...remainingIng], ...lines.map(x => x.ing));
			if (ings.length === 1) {
				allocated.set(aller, ings[0]);
				remainingAller.delete(aller);
				remainingIng.delete(ings[0]);
				break;
			}
		}
	}

	return [...allocated.keys()].sort().map(x => allocated.get(x)).join(',')
}

function parseInput(str) {
	return autoparse(str).map(line => {
		const [_, ing, aller] = /([\w ]+) \(contains ([\w, ]+)\)/.exec(line);
		return { ing: ing.split(' '), aller: aller.split(', ') };
	});
}
