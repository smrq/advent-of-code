const { getRawInput, runTests, sum, product } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function parseInput(str) {
	return str.split('\n').map(x => +x).sort((a, b) => b - a);
}

function run(arr) {
	const targetWeight = sum(arr) / 3;

	const partition1 = getPartitions(arr, targetWeight)
		.sort((a, b) => a.length - b.length ||
			product(a) - product(b));
	
	for (let items1 of partition1) {
		// all items are unique in the input
		const items23 = arr.filter(x => !items1.includes(x));
		
		if (partitionExists(items23, targetWeight)) {
			return product(items1);
		}
	}

	function getPartitions(arr, remaining) {
		if (!arr.length) {
			return [];
		}

		const [item, ...rest] = arr;

		if (item === remaining) {
			return [[item]];
		}

		if (item < remaining) {
			return [
				...getPartitions(rest, remaining),
				...getPartitions(rest, remaining - item).map(ls => [item, ...ls])
			];
		} else {
			return getPartitions(rest, remaining);
		}
	}

	function partitionExists(arr, remaining) {
		if (!arr.length) {
			return false;
		}

		const [item, ...rest] = arr;

		if (item === remaining) {
			return true;
		}

		if (item < remaining && partitionExists(rest, remaining - item)) {
			return true;
		}

		return partitionExists(rest, remaining);
	}
}