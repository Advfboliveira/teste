"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepRandomTime = void 0;
function sleepRandomTime({ minMilliseconds, maxMilliseconds }) {
    const min = !minMilliseconds ? 2 : minMilliseconds;
    const max = !maxMilliseconds ? 4 : maxMilliseconds;
    const ms = Math.random() * (max - min) + min;
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
exports.sleepRandomTime = sleepRandomTime;
//# sourceMappingURL=sleepRandomTime.js.map