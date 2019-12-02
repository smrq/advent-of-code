const fs = require('fs');
const log = fs.readFileSync('04.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(str => {
		const [_, timestamp, log] = /\[\d{2}(.+)\] (.+)/.exec(str);
		return { timestamp, log };
	})
	.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

const guards = readLog(log);
const guard = Object.values(guards)
	.sort((a, b) => b.asleepMinutes - a.asleepMinutes)
	[0]
console.log(+guard.id * guard.mostAsleepMinute);

function readLog(log) {
	const guards = {};
	let currentGuard;
	let asleepTime;
	log.forEach(line => {
		if (/begins shift/.test(line.log)) {
			currentGuard = /Guard #(\d+)/.exec(line.log)[1];
		} else if (line.log === 'falls asleep') {
			asleepTime = +line.timestamp.slice(-2);
		} else if (line.log === 'wakes up') {
			const wakeTime = +line.timestamp.slice(-2);
			guards[currentGuard] = guards[currentGuard] || { id: currentGuard, asleepMinutes: 0, times: [] };
			guards[currentGuard].asleepMinutes += wakeTime - asleepTime;
			guards[currentGuard].times.push([ asleepTime, wakeTime ]);
		} else {
			throw new Error(line);
		}
	});

	Object.values(guards).forEach(guard => {
		guard.minutes = Array.from({ length: 60 }).map(_ => 0);
		guard.times.forEach(([ asleepTime, wakeTime ]) => {
			for (let t = asleepTime; t < wakeTime; ++t) {
				++guard.minutes[t];
			}
		});
		guard.mostAsleepMinute = guard.minutes.indexOf(Math.max(...guard.minutes));
	});

	return guards;
}
