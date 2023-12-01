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
const socket_1 = require("../../libs/socket");
const logger_1 = require("../../utils/logger");
const StartWhatsAppSession_1 = require("./StartWhatsAppSession");
const wbotMonitor = (wbot, whatsapp) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    const sessionName = whatsapp.name;
    try {
        wbot.on("change_state", (newState) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.logger.info(`Monitor session: ${sessionName} - NewState: ${newState}`);
            try {
                yield whatsapp.update({ status: newState });
            }
            catch (err) {
                logger_1.logger.error(err);
            }
            io.emit(`${whatsapp.tenantId}:whatsappSession`, {
                action: "update",
                session: whatsapp
            });
        }));
        wbot.on("change_battery", (batteryInfo) => __awaiter(void 0, void 0, void 0, function* () {
            const { battery, plugged } = batteryInfo;
            logger_1.logger.info(`Battery session: ${sessionName} ${battery}% - Charging? ${plugged}`);
            if (battery <= 20 && !plugged) {
                io.emit(`${whatsapp.tenantId}:change_battery`, {
                    action: "update",
                    batteryInfo: Object.assign(Object.assign({}, batteryInfo), { sessionName })
                });
            }
            try {
                yield whatsapp.update({ battery, plugged });
            }
            catch (err) {
                logger_1.logger.error(err);
            }
            io.emit(`${whatsapp.tenantId}:whatsappSession`, {
                action: "update",
                session: whatsapp
            });
        }));
        wbot.on("disconnected", (reason) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.logger.info(`Disconnected session: ${sessionName} | Reason: ${reason}`);
            try {
                yield whatsapp.update({
                    status: "OPENING",
                    session: "",
                    qrcode: null
                });
                // await apagarPastaSessao(whatsapp.id);
                setTimeout(() => (0, StartWhatsAppSession_1.StartWhatsAppSession)(whatsapp), 2000);
            }
            catch (err) {
                logger_1.logger.error(err);
            }
            io.emit(`${whatsapp.tenantId}:whatsappSession`, {
                action: "update",
                session: whatsapp
            });
        }));
    }
    catch (err) {
        logger_1.logger.error(err);
    }
});
exports.default = wbotMonitor;
//# sourceMappingURL=wbotMonitor.js.map