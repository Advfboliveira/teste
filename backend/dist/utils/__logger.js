"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const configPino = {
    dev: {
        enabled: true,
        level: "info"
    },
    prod: {
        enabled: true,
        level: "info",
        prettyPrint: {
            ignore: "pid,hostname"
        }
    }
};
let env = "prod";
if ((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) {
    env = process.env.NODE_ENV;
}
const logger = (0, pino_1.default)(env === "prod" ? configPino.prod : configPino.dev);
exports.logger = logger;
//# sourceMappingURL=__logger.js.map