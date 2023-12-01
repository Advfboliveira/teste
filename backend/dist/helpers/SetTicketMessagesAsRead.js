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
const messengerBot_1 = require("../libs/messengerBot");
const Message_1 = __importDefault(require("../models/Message"));
const ShowTicketService_1 = __importDefault(require("../services/TicketServices/ShowTicketService"));
const logger_1 = require("../utils/logger");
const GetTicketWbot_1 = __importDefault(require("./GetTicketWbot"));
const socketEmit_1 = __importDefault(require("./socketEmit"));
const SetTicketMessagesAsRead = (ticket) => __awaiter(void 0, void 0, void 0, function* () {
    yield Message_1.default.update({ read: true }, {
        where: {
            ticketId: ticket.id,
            read: false
        }
    });
    yield ticket.update({ unreadMessages: 0 });
    try {
        if (ticket.channel === "whatsapp") {
            const wbot = yield (0, GetTicketWbot_1.default)(ticket);
            wbot.sendSeen(`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`);
        }
        if (ticket.channel === "messenger") {
            const messengerBot = (0, messengerBot_1.getMessengerBot)(ticket.whatsappId);
            messengerBot.markSeen(ticket.contact.messengerId);
        }
    }
    catch (err) {
        logger_1.logger.warn(`Could not mark messages as read. Maybe whatsapp session disconnected? Err: ${err}`);
        // throw new Error("ERR_WAPP_NOT_INITIALIZED");
    }
    const ticketReload = yield (0, ShowTicketService_1.default)({
        id: ticket.id,
        tenantId: ticket.tenantId
    });
    (0, socketEmit_1.default)({
        tenantId: ticket.tenantId,
        type: "ticket:update",
        payload: ticketReload
    });
});
exports.default = SetTicketMessagesAsRead;
//# sourceMappingURL=SetTicketMessagesAsRead.js.map