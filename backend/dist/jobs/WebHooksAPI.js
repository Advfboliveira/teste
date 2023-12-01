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
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
exports.default = {
    key: "WebHooksAPI",
    options: {
        delay: 6000,
        attempts: 50,
        backoff: {
            type: "fixed",
            delay: 60000 * 3 // 3 min
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handle({ data }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = {};
                // return se não houver url informada
                if (!(data === null || data === void 0 ? void 0 : data.url)) {
                    return { message: "url configurar no webhook não existe." };
                }
                if (data.type === "hookMessageStatus") {
                    payload = {
                        ack: data.payload.ack,
                        messageId: data.payload.messageId,
                        externalKey: data.payload.externalKey,
                        type: data.type
                    };
                }
                if (data.type === "hookMessage") {
                    payload = {
                        timestamp: data.payload.timestamp,
                        message: data.payload.msg,
                        messageId: data.payload.messageId,
                        ticketId: data.payload.ticketId,
                        externalKey: data.payload.externalKey,
                        type: data.type
                    };
                }
                if (data.type === "hookSessionStatus") {
                    payload = {
                        name: data.payload.name,
                        number: data.payload.number,
                        status: data.payload.status,
                        qrcode: data.payload.qrcode,
                        timestamp: data.payload.timestamp,
                        type: data.type
                    };
                }
                if (data.payload.authToken) {
                    yield axios_1.default.post(data.url, payload, {
                        headers: { authorization: data.payload.authToken }
                    });
                }
                else {
                    yield axios_1.default.post(data.url, payload);
                }
                logger_1.logger.info(`Queue WebHooksAPI success: Data: ${data} Payload: ${payload}`);
                return {
                    data,
                    payload
                };
            }
            catch (error) {
                logger_1.logger.error(`Error send message api: ${error}`);
                if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                    return { message: "url configurar no webhook não existe." };
                }
                throw new Error(error);
            }
        });
    }
};
//# sourceMappingURL=WebHooksAPI.js.map