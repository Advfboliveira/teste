"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { v4 as uuid } from "uuid";
const wbot_1 = require("../libs/wbot");
const SendMessagesSystemWbot_1 = __importDefault(require("../services/WbotServices/SendMessagesSystemWbot"));
const logger_1 = require("../utils/logger");
const sending = {};
exports.default = {
    key: "SendMessages",
    options: {
        attempts: 0,
        removeOnComplete: true,
        removeOnFail: true
        // repeat: {
        //   every: 5000
        // }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handle({ data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`Sending Tenant Initiated: ${data.tenantId}`);
                if (sending[data.tenantId])
                    return;
                const wbot = (0, wbot_1.getWbot)(data.sessionId);
                sending[data.tenantId] = true;
                yield (0, SendMessagesSystemWbot_1.default)(wbot, data.tenantId);
                sending[data.tenantId] = false;
                logger_1.logger.info(`Finalized Sending Tenant: ${data.tenantId}`);
            }
            catch (error) {
                logger_1.logger.error({ message: "Error send messages", error });
                sending[data.tenantId] = false;
                throw new Error(error);
            }
        });
    }
};
//# sourceMappingURL=SendMessages.js.map