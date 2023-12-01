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
const date_fns_1 = require("date-fns");
const Message_1 = __importDefault(require("../models/Message"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const tbot_1 = require("../libs/tbot");
// import { getInstaBot } from "../libs/InstaBot";
const GetWbotMessage_1 = __importDefault(require("./GetWbotMessage"));
const socketEmit_1 = __importDefault(require("./socketEmit"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const DeleteMessageSystem = (id, messageId, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message_1.default.findOne({
        where: { id },
        include: [
            {
                model: Ticket_1.default,
                as: "ticket",
                include: ["contact"],
                where: { tenantId }
            }
        ]
    });
    if (message) {
        const diffHoursDate = (0, date_fns_1.differenceInHours)(new Date(), (0, date_fns_1.parseJSON)(message === null || message === void 0 ? void 0 : message.createdAt));
        if (diffHoursDate > 2) {
            throw new AppError_1.default("No delete message afeter 2h sended");
        }
    }
    if (!message) {
        throw new AppError_1.default("No message found with this ID.");
    }
    const { ticket } = message;
    if (ticket.channel === "whatsapp") {
        const messageToDelete = yield (0, GetWbotMessage_1.default)(ticket, messageId);
        yield messageToDelete.delete(true);
    }
    if (ticket.channel === "telegram") {
        const telegramBot = yield (0, tbot_1.getTbot)(ticket.whatsappId);
        yield telegramBot.telegram.deleteMessage(ticket.contact.telegramId, +message.messageId);
    }
    if (ticket.channel === "instagram") {
        // const chatId = ticket.contact.instagramPK;
        // const instaBot = await getInstaBot(ticket.whatsappId);
        // const threadEntity = await instaBot.entity.directThread([chatId]);
        // if (!threadEntity.threadId) return;
        // await threadEntity.deleteItem(message.messageId);
        return;
    }
    // não possui suporte para apagar mensagem
    if (ticket.channel === "messenger") {
        return;
    }
    yield message.update({ isDeleted: true });
    (0, socketEmit_1.default)({
        tenantId: ticket.tenantId,
        type: "chat:delete",
        payload: message
    });
});
exports.default = DeleteMessageSystem;
//# sourceMappingURL=DeleteMessageSystem.js.map