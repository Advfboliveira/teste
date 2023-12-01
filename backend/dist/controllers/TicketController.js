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
exports.showLogsTicket = exports.remove = exports.update = exports.show = exports.store = exports.index = void 0;
const sequelize_1 = require("sequelize");
// import GetWbotMessage from "../helpers/GetWbotMessage";
const socket_1 = require("../libs/socket");
const Message_1 = __importDefault(require("../models/Message"));
const CreateLogTicketService_1 = __importDefault(require("../services/TicketServices/CreateLogTicketService"));
const CreateTicketService_1 = __importDefault(require("../services/TicketServices/CreateTicketService"));
const DeleteTicketService_1 = __importDefault(require("../services/TicketServices/DeleteTicketService"));
const ListTicketsService_1 = __importDefault(require("../services/TicketServices/ListTicketsService"));
const ShowLogTicketService_1 = __importDefault(require("../services/TicketServices/ShowLogTicketService"));
const ShowTicketService_1 = __importDefault(require("../services/TicketServices/ShowTicketService"));
const UpdateTicketService_1 = __importDefault(require("../services/TicketServices/UpdateTicketService"));
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const CreateMessageSystemService_1 = __importDefault(require("../services/MessageServices/CreateMessageSystemService"));
const pupa_1 = require("../utils/pupa");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, profile } = req.user;
    const { searchParam, pageNumber, status, date, showAll, withUnreadMessages, queuesIds, isNotAssignedUser, includeNotQueueDefined } = req.query;
    const userId = req.user.id;
    const { tickets, count, hasMore } = yield (0, ListTicketsService_1.default)({
        searchParam,
        pageNumber,
        status,
        date,
        showAll,
        userId,
        withUnreadMessages,
        queuesIds,
        isNotAssignedUser,
        includeNotQueueDefined,
        tenantId,
        profile
    });
    return res.status(200).json({ tickets, count, hasMore });
});
exports.index = index;
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { contactId, status, userId, channel, channelId } = req.body;
    const ticket = yield (0, CreateTicketService_1.default)({
        contactId,
        status,
        userId,
        tenantId,
        channel,
        channelId
    });
    // se ticket criado pelo próprio usuário, não emitir socket.
    if (!userId) {
        const io = (0, socket_1.getIO)();
        io.to(`${tenantId}:${ticket.status}`).emit(`${tenantId}:ticket`, {
            action: "create",
            ticket
        });
    }
    return res.status(200).json(ticket);
});
exports.store = store;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { tenantId } = req.user;
    const userId = req.user.id;
    const ticket = yield (0, ShowTicketService_1.default)({ id: ticketId, tenantId });
    // const messages = await Message.findAll({
    //   where: {
    //     fromMe: true,
    //     ticketId: ticket.id,
    //     ack: 0,
    //     messageId: { [Op.not]: null }
    //   },
    //   logging: console.log
    // });
    // if (messages) {
    //   await Promise.all(
    //     messages.map(async message => {
    //       console.info(message);
    //       const msg = await GetWbotMessage(ticket, message.messageId);
    //       console.log(msg);
    //     })
    //   );
    // }
    const where = {
        contactId: ticket.contactId,
        scheduleDate: { [sequelize_1.Op.not]: null },
        status: "pending"
    };
    const scheduledMessages = yield Message_1.default.findAll({
        where
        // logging: console.log
    });
    ticket.setDataValue("scheduledMessages", scheduledMessages);
    yield (0, CreateLogTicketService_1.default)({
        userId,
        ticketId,
        type: "access"
    });
    return res.status(200).json(ticket);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { tenantId } = req.user;
    const userIdRequest = req.user.id;
    const { isTransference } = req.body;
    const ticketData = Object.assign(Object.assign({}, req.body), { tenantId });
    const { ticket } = yield (0, UpdateTicketService_1.default)({
        ticketData,
        ticketId,
        isTransference,
        userIdRequest
    });
    if (ticket.status === "closed") {
        const whatsapp = yield Whatsapp_1.default.findOne({
            where: { id: ticket.whatsappId, tenantId }
        });
        if (whatsapp === null || whatsapp === void 0 ? void 0 : whatsapp.farewellMessage) {
            const body = (0, pupa_1.pupa)(whatsapp.farewellMessage || "", {
                protocol: ticket.protocol,
                name: ticket.contact.name
            });
            const messageData = {
                msg: { body, fromMe: true, read: true },
                tenantId,
                ticket,
                userId: req.user.id,
                sendType: "bot",
                status: "pending",
                isTransfer: false,
                note: false
            };
            yield (0, CreateMessageSystemService_1.default)(messageData);
            ticket.update({ isFarewellMessage: true });
        }
    }
    return res.status(200).json(ticket);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { tenantId } = req.user;
    const userId = req.user.id;
    const ticket = yield (0, DeleteTicketService_1.default)({ id: ticketId, tenantId, userId });
    const io = (0, socket_1.getIO)();
    io.to(`${tenantId}:${ticket.status}`)
        .to(`${tenantId}:${ticketId}`)
        .to(`${tenantId}:notification`)
        .emit(`${tenantId}:ticket`, {
        action: "delete",
        ticketId: +ticketId
    });
    return res.status(200).json({ message: "ticket deleted" });
});
exports.remove = remove;
const showLogsTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const logsTicket = yield (0, ShowLogTicketService_1.default)({ ticketId });
    return res.status(200).json(logsTicket);
});
exports.showLogsTicket = showLogsTicket;
//# sourceMappingURL=TicketController.js.map