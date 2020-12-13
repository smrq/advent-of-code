const rawInput = '1321131112';

let s = rawInput;
for (let n = 0; n < 50; ++n) {
	s = lookAndSay(s);
}
console.log(s.length);

function lookAndSay(str) {
	let count = 1;
	let c = str[0];
	let result = '';

	for (let i = 1; i < str.length; ++i) {
		if (str[i] === c) {
			++count;
		} else {
			result += count;
			result += c;
			c = str[i];
			count = 1;
		}
	}
	result += count;
	result += c;
	return result;
}