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
const sequelize_1 = require("sequelize");
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const ShowTicketService_1 = __importDefault(require("../TicketServices/ShowTicketService"));
const CreateForwardMessageService = ({ userId, tenantId, message, contact, ticketIdOrigin }) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketOrigin = yield (0, ShowTicketService_1.default)({
        id: ticketIdOrigin,
        tenantId
    });
    let ticket;
    ticket = yield Ticket_1.default.findOne({
        where: {
            status: {
                [sequelize_1.Op.or]: ["open", "pending"]
            },
            tenantId,
            contactId: contact.id
        }
    });
    // caso não exista ticket aberto ou pendente
    if (!ticket) {
        ticket = yield Ticket_1.default.create({
            contactId: contact.id,
            status: "open",
            isGroup: contact.isGroup,
            userId,
            tenantId,
            unreadMessages: 0,
            whatsappId: ticketOrigin.whatsappId,
            lastMessage: message.body,
            lastMessageAt: new Date().getTime(),
            answered: true
        });
    }
    // preparar dados para criação da mensagem
    const msgData = {
        body: message.body,
        contactId: contact.id,
        fromMe: true,
        read: true,
        mediaType: message === null || message === void 0 ? void 0 : message.mediaType,
        mediaUrl: message === null || message === void 0 ? void 0 : message.mediaName,
        mediaName: message === null || message === void 0 ? void 0 : message.mediaName,
        timestamp: new Date().getTime(),
        userId,
        scheduleDate: null,
        sendType: "chat",
        status: "pending",
        ticketId: ticket.id,
        tenantId
    };
    const msgCreated = yield Message_1.default.create(msgData);
    const messageCreated = yield Message_1.default.findByPk(msgCreated.id, {
        include: [
            {
                model: Ticket_1.default,
                as: "ticket",
                where: { tenantId },
                include: ["contact"]
            },
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ]
    });
    if (!messageCreated) {
        // throw new AppError("ERR_CREATING_MESSAGE", 501);
        throw new Error("ERR_CREATING_MESSAGE_SYSTEM");
    }
    yield ticket.update({
        lastMessage: messageCreated.body,
        lastMessageAt: new Date().getTime(),
        answered: true
    });
    (0, socketEmit_1.default)({
        tenantId,
        type: "chat:create",
        payload: messageCreated
    });
});
exports.default = CreateForwardMessageService;
//# sourceMappingURL=CreateForwardMessageService.js.map