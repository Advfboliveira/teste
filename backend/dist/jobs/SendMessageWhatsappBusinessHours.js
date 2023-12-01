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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = require("../utils/logger");
const wbot_1 = require("../libs/wbot");
exports.default = {
    key: "SendMessageWhatsappBusinessHours",
    options: {
        delay: 60000,
        attempts: 10,
        backoff: {
            type: "fixed",
            delay: 60000 * 5 // 5 min
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handle({ data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wbot = (0, wbot_1.getWbot)(data.ticket.whatsappId);
                const message = yield wbot.sendMessage(`${data.ticket.contact.number}@c.us`, data.tenant.messageBusinessHours, {
                    linkPreview: false
                });
                const result = {
                    message,
                    messageBusinessHours: data.tenant.messageBusinessHours,
                    ticket: data.ticket
                };
                return result;
            }
            catch (error) {
                logger_1.logger.error(`Error enviar message business hours: ${error}`);
                throw new Error(error);
            }
        });
    }
};
//# sourceMappingURL=SendMessageWhatsappBusinessHours.js.map