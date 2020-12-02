const input = 34000000;

for (let n = 1; ; ++n) {
	let presents = 0;
	for (let x of factors(n)) {
		presents += 11 * x;
	}
	if (presents >= input) {
		console.log(n);
		break;
	}
}

function *factors(n) {
	const sqrtN = Math.sqrt(n);
	for (let i = 1; i <= 50; ++i) {
		if (n % i === 0) {
			yield n / i;
		}
	}
}
