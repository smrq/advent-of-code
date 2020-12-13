import { runTests, getRawInput } from '../lib.mjs';
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(run, [
	parseInput(`Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`),
	62842880,
]);

console.log(run(input));

function parseInput(str) {
	const re = /(\w+): capacity ([-\d]+), durability ([-\d]+), flavor ([-\d]+), texture ([-\d]+), calories ([-\d]+)/;
	return str.split('\n')
		.map(str => re.exec(str))
		.map(([_, name, capacity, durability, flavor, texture, calories]) => ({
			name: name,
			capacity: +capacity,
			durability: +durability,
			flavor: +flavor,
			texture: +texture,
			calories: +calories,
		}));
}

function run(props) {
	let best = 0;
	run_(0, 0, 0, 0, props, 100);
	return best;

	function run_(capacity, durability, flavor, texture, props, room) {
		if (props.length === 1) {
			capacity += room*props[0].capacity;
			durability += room*props[0].durability;
			flavor += room*props[0].flavor;
			texture += room*props[0].texture;
			if (capacity <= 0 || durability <= 0 || flavor <= 0 || texture <= 0) {
				return;
			}
			const s = capacity * durability * flavor * texture;
			if (s > best) {
				best = s;
			}
		} else {
			for (let n = 0; n < room; ++n) {
				run_(
					capacity + n*props[0].capacity,
					durability + n*props[0].durability,
					flavor + n*props[0].flavor,
					texture + n*props[0].texture,
					props.slice(1),
					room - n
				);
			}
		}
	}
}
