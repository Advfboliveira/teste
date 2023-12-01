"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeValue = exports.setValue = exports.getValue = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default({
    port: Number(process.env.IO_REDIS_PORT),
    host: process.env.IO_REDIS_SERVER,
    db: Number(process.env.IO_REDIS_DB_SESSION) || 9,
    password: process.env.IO_REDIS_PASSWORD || undefined
});
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getValue = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err)
                return reject(err);
            let data;
            if (value) {
                try {
                    data = JSON.parse(value || "");
                }
                catch (error) {
                    data = String(value);
                }
            }
            else {
                data = value;
            }
            return resolve(data);
        });
    });
};
exports.getValue = getValue;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const setValue = (key, value) => {
    return new Promise((resolve, reject) => {
        let stringfy;
        if (typeof value === "object") {
            stringfy = JSON.stringify(value);
        }
        else {
            stringfy = String(value);
        }
        redisClient.set(key, stringfy, err => {
            if (err)
                return reject(err);
            return resolve(stringfy);
        });
    });
};
exports.setValue = setValue;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const removeValue = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.del(key, err => {
            if (err)
                return reject(err);
            return resolve(true);
        });
    });
};
exports.removeValue = removeValue;
//# sourceMappingURL=redisClient.js.map