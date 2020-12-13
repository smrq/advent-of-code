import { getRawInput, runTests, sum, product } from '../lib.mjs';
const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function parseInput(str) {
	return str.split('\n').map(x => +x).sort((a, b) => b - a);
}

function run(arr) {
	const targetWeight = sum(arr) / 4;

	const partition1 = getPartitions(arr, targetWeight)
		.sort((a, b) => a.length - b.length ||
			product(a) - product(b));

	for (let items1 of partition1) {
		// all items are unique in the input
		const items234 = arr.filter(x => !items1.includes(x));
		const partition2 = getPartitions(items234, targetWeight);

		for (let items2 of partition2) {
			const items34 = items234.filter(x => !items2.includes(x));
			
			if (partitionExists(items34, targetWeight)) {
				return product(items34);
			}
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