const { getRawInput } = require('../lib');
const rawInput = getRawInput();
const input = rawInput.split('\n').map(x => +x);

for (let i = 0; i < input.length; ++i) {
	for (let j = i + 1; j < input.length; ++j) {
		if (input[i] + input[j] === 2020) {
			console.log(input[i] * input[j]);
			return;
		}
	}
}

