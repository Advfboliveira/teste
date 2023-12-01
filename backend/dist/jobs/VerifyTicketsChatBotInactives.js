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
const FindUpdateTicketsInactiveChatBot_1 = __importDefault(require("../services/TicketServices/FindUpdateTicketsInactiveChatBot"));
const logger_1 = require("../utils/logger");
exports.default = {
    key: "VerifyTicketsChatBotInactives",
    options: {
        // attempts: 0,
        removeOnComplete: false,
        removeOnFail: false,
        jobId: "VerifyTicketsChatBotInactives",
        repeat: {
            every: 5 * 60 * 1000
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info("FindUpdateTicketsInactiveChatBot Initiated");
                yield (0, FindUpdateTicketsInactiveChatBot_1.default)();
                logger_1.logger.info("Finalized FindUpdateTicketsInactiveChatBot");
            }
            catch (error) {
                logger_1.logger.error({ message: "Error send messages", error });
                throw new Error(error);
            }
        });
    }
};
//# sourceMappingURL=VerifyTicketsChatBotInactives.js.map