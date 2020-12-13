import { runTests } from '../lib.mjs';

const rawInput = 'hxbxwxba';

runTests(increment, [
	'abcdefgh', 'abcdffaa',
	'ghijklmn', 'ghjaabcc',
]);

console.log(increment(increment(rawInput)));

function increment(str) {
	let nums = toArr(str);
	initialIterate(nums);
	while (!valid(nums)) {
		iterate(nums);
	}
	return toStr(nums);

	function toArr(str) {
		return str.split('').map(x => x.charCodeAt(0) - 'a'.charCodeAt(0));
	}

	function toStr(arr) {
		return arr.map(x => String.fromCharCode(x + 'a'.charCodeAt(0))).join('');
	}

	function initialIterate(nums) {
		for (let i = 0; i < nums.length; ++i) {
			if (nums[i] === 8 || nums[i] === 11 || nums[i] === 14) {
				++nums[i];
				for (let j = i+1; j < nums.length; ++j) {
					nums[j] = 0;
				}
				return;
			}
		}
		iterate(nums);
	}

	function iterate(nums) {
		for (let i = nums.length - 1; i >= 0; --i) {
			if (nums[i] < 25) {
				++nums[i];
				if (nums[i] === 8 || nums[i] === 11 || nums[i] === 14) {
					++nums[i];
				}
				break;
			} else {
				nums[i] = 0;
			}
		}
	}

	function valid(nums) {
		return hasStraight(nums) && hasTwoPairs(nums);

		function hasStraight(nums) {
			for (let i = 0; i < nums.length - 2; ++i) {
				if (nums[i] === nums[i+1] - 1 && nums[i] === nums[i+2] - 2) {
					return true;
				}
			}
			return false;
		}

		function hasTwoPairs(nums) {
			let pairs = 0;
			for (let i = 0; i < nums.length - 1; ++i) {
				if (nums[i] === nums[i+1]) {
					++pairs;
					++i;
					if (pairs === 2) {
						return true;
					}
				}
			}
			return false;
		}
	}
}
