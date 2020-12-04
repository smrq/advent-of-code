const { getRawInput } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	return input.filter(passport => {
		return passport.byr != null &&
			/^\d{4}$/.test(passport.byr) &&
			parseInt(passport.byr, 10) >= 1920 &&
			parseInt(passport.byr, 10) <= 2002 &&

			passport.iyr != null &&
			/^\d{4}$/.test(passport.iyr) &&
			parseInt(passport.iyr, 10) >= 2010 &&
			parseInt(passport.iyr, 10) <= 2020 &&
			
			passport.eyr != null &&
			/^\d{4}$/.test(passport.eyr) &&
			parseInt(passport.eyr, 10) >= 2020 &&
			parseInt(passport.eyr, 10) <= 2030 &&
			
			passport.hgt != null &&
			((
				/cm$/.test(passport.hgt) &&
				parseInt(passport.hgt, 10) >= 150 &&
				parseInt(passport.hgt, 10) <= 193
			) || (
				/in$/.test(passport.hgt) &&
				parseInt(passport.hgt, 10) >= 59 &&
				parseInt(passport.hgt, 10) <= 76
			)) &&

			passport.hcl != null &&
			/^#[0-9a-f]{6}$/.test(passport.hcl) &&

			passport.ecl != null &&
			/^(amb|blu|brn|gry|grn|hzl|oth)$/.test(passport.ecl) &&

			passport.pid != null &&
			/^[0-9]{9}$/.test(passport.pid);
	}).length;
}

function parseInput(str) {
	return str.split('\n\n').map(block => {
		const result = {};
		block.split(/[\n ]/g).map(x => x.split(':'))
			.forEach(x => result[x[0]] = x[1]);
		return result;
	});
}
