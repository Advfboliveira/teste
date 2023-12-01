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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CheckContactOpenTickets_1 = __importDefault(require("../../helpers/CheckContactOpenTickets"));
const SetTicketMessagesAsRead_1 = __importDefault(require("../../helpers/SetTicketMessagesAsRead"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const User_1 = __importDefault(require("../../models/User"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const CreateLogTicketService_1 = __importDefault(require("./CreateLogTicketService"));
const UpdateTicketService = ({ ticketData, ticketId, isTransference, userIdRequest }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { status, userId, tenantId, queueId } = ticketData;
    const ticket = yield Ticket_1.default.findOne({
        where: { id: ticketId, tenantId },
        include: [
            {
                model: Contact_1.default,
                as: "contact",
                include: [
                    "extraInfo",
                    "tags",
                    {
                        association: "wallets",
                        attributes: ["id", "name"]
                    }
                ]
            },
            {
                model: User_1.default,
                as: "user",
                attributes: ["id", "name"]
            },
            {
                association: "whatsapp",
                attributes: ["id", "name"]
            }
        ]
    });
    if (!ticket) {
        throw new AppError_1.default("ERR_NO_TICKET_FOUND", 404);
    }
    yield (0, SetTicketMessagesAsRead_1.default)(ticket);
    // Variavel para notificar usuário de novo contato como pendente
    const toPending = ticket.status !== "pending" && ticketData.status === "pending";
    const oldStatus = ticket.status;
    const oldUserId = (_a = ticket.user) === null || _a === void 0 ? void 0 : _a.id;
    if (oldStatus === "closed") {
        yield (0, CheckContactOpenTickets_1.default)(ticket.contact.id);
    }
    // verificar se o front envia close e substituir por closed
    const statusData = status === "close" ? "closed" : status;
    const data = {
        status: statusData,
        queueId,
        userId
    };
    // se atendimento for encerrado, informar data da finalização
    if (statusData === "closed") {
        data.closedAt = new Date().getTime();
    }
    // se iniciar atendimento, retirar o bot e informar a data
    if (oldStatus === "pending" && statusData === "open") {
        data.autoReplyId = null;
        data.stepAutoReplyId = null;
        data.startedAttendanceAt = new Date().getTime();
    }
    yield ticket.update(data);
    // logar o inicio do atendimento
    if (oldStatus === "pending" && statusData === "open") {
        yield (0, CreateLogTicketService_1.default)({
            userId: userIdRequest,
            ticketId,
            type: "open"
        });
    }
    // logar ticket resolvido
    if (statusData === "closed") {
        yield (0, CreateLogTicketService_1.default)({
            userId: userIdRequest,
            ticketId,
            type: "closed"
        });
    }
    // logar ticket retornado à pendente
    if (oldStatus === "open" && statusData === "pending") {
        yield (0, CreateLogTicketService_1.default)({
            userId: userIdRequest,
            ticketId,
            type: "pending"
        });
    }
    if (isTransference) {
        // tranferiu o atendimento
        yield (0, CreateLogTicketService_1.default)({
            userId: userIdRequest,
            ticketId,
            type: "transfered"
        });
        // recebeu o atendimento tansferido
        if (userId) {
            yield (0, CreateLogTicketService_1.default)({
                userId,
                ticketId,
                type: "receivedTransfer"
            });
        }
    }
    yield ticket.reload();
    if (isTransference) {
        yield ticket.setDataValue("isTransference", true);
    }
    if (toPending) {
        (0, socketEmit_1.default)({
            tenantId,
            type: "notification:new",
            payload: ticket
        });
    }
    (0, socketEmit_1.default)({
        tenantId,
        type: "ticket:update",
        payload: ticket
    });
    return { ticket, oldStatus, oldUserId };
});
exports.default = UpdateTicketService;
//# sourceMappingURL=UpdateTicketService.js.map