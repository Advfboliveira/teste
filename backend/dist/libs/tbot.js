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
exports.removeTbot = exports.getTbot = exports.initTbot = void 0;
const telegraf_1 = require("telegraf");
const socket_1 = require("./socket");
const logger_1 = require("../utils/logger");
const TelegramSessions = [];
const initTbot = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const io = (0, socket_1.getIO)();
            const sessionName = connection.name;
            const { tenantId } = connection;
            const tbot = new telegraf_1.Telegraf(connection.tokenTelegram, {});
            tbot.id = connection.id;
            const sessionIndex = TelegramSessions.findIndex(s => s.id === connection.id);
            if (sessionIndex === -1) {
                tbot.id = connection.id;
                TelegramSessions.push(tbot);
            }
            else {
                tbot.id = connection.id;
                TelegramSessions[sessionIndex] = tbot;
            }
            tbot.launch();
            connection.update({
                status: "CONNECTED",
                qrcode: "",
                retries: 0
            });
            io.emit(`${tenantId}:whatsappSession`, {
                action: "update",
                session: connection
            });
            logger_1.logger.info(`Session TELEGRAM: ${sessionName} - READY `);
            // Enable graceful stop
            process.once("SIGINT", () => tbot.stop("SIGINT"));
            process.once("SIGTERM", () => tbot.stop("SIGTERM"));
            resolve(tbot);
        }
        catch (error) {
            connection.update({
                status: "DISCONNECTED",
                qrcode: "",
                retries: 0
            });
            logger_1.logger.error(`initWbot error | Error: ${error}`);
            reject(new Error("Error starting telegram session."));
        }
    });
});
exports.initTbot = initTbot;
const getTbot = (whatsappId, checkState = true) => {
    logger_1.logger.info(`whatsappId: ${whatsappId} | checkState: ${checkState}`);
    const sessionIndex = TelegramSessions.findIndex(s => s.id === whatsappId);
    return TelegramSessions[sessionIndex];
};
exports.getTbot = getTbot;
const removeTbot = (whatsappId) => {
    try {
        const sessionIndex = TelegramSessions.findIndex(s => s.id === whatsappId);
        const sessionSet = TelegramSessions[sessionIndex];
        if (sessionIndex !== -1) {
            // Enable graceful stop
            process.once("SIGINT", () => sessionSet.stop("SIGINT"));
            process.once("SIGTERM", () => sessionSet.stop("SIGTERM"));
            TelegramSessions.splice(sessionIndex, 1);
        }
    }
    catch (err) {
        logger_1.logger.error(`removeTbot | Error: ${err}`);
    }
};
exports.removeTbot = removeTbot;
//# sourceMappingURL=tbot.js.map