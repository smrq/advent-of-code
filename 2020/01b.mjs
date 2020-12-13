import { getRawInput } from '../lib.mjs';
const rawInput = getRawInput();
const input = rawInput.split('\n').map(x => +x);

(() => {
	for (let i = 0; i < input.length; ++i) {
		for (let j = i + 1; j < input.length; ++j) {
			for (let k = j + 1; k < input.length; ++k) {
				if (input[i] + input[j] + input[k] === 2020) {
					console.log(input[i] * input[j] * input[k]);
					return;
				}
			}
		}
	}
})();
