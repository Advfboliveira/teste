"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Use JSON logging for log files
// Here winston.format.errors() just seem to work
// because there is no winston.format.simple()
const jsonLogFileFormat = winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint());
let env = "prod";
if ((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) {
    env = process.env.NODE_ENV;
}
const level = env === "prod" ? "info" : "debug";
// Create file loggers
const logger = winston_1.default.createLogger({
    level,
    format: jsonLogFileFormat,
    // expressFormat: true,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize(), 
            // eslint-disable-next-line no-shadow
            winston_1.default.format.printf(({ level, message, timestamp, stack }) => {
                if (stack) {
                    // print log trace
                    return `${level}: ${timestamp} ${message} - ${stack}`;
                }
                return `${level}: ${timestamp} ${message}`;
            }))
        }),
        new winston_1.default.transports.File({
            filename: "./logs/app.logg",
            level: "error",
            handleExceptions: true,
            maxsize: 10485760,
            maxFiles: 10
        }),
        new winston_1.default.transports.Http({
            level: "warn",
            format: winston_1.default.format.json()
        })
    ]
});
exports.logger = logger;
//# sourceMappingURL=logger.js.map