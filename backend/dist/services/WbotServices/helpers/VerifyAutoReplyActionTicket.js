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
const socketEmit_1 = __importDefault(require("../../../helpers/socketEmit"));
// import { sleepRandomTime } from "../../../utils/sleepRandomTime";
const CreateAutoReplyLogsService_1 = __importDefault(require("../../AutoReplyServices/CreateAutoReplyLogsService"));
const ShowStepAutoReplyMessageService_1 = __importDefault(require("../../AutoReplyServices/ShowStepAutoReplyMessageService"));
const VerifyActionStepAutoReplyService_1 = __importDefault(require("../../AutoReplyServices/VerifyActionStepAutoReplyService"));
const CreateMessageSystemService_1 = __importDefault(require("../../MessageServices/CreateMessageSystemService"));
const CreateLogTicketService_1 = __importDefault(require("../../TicketServices/CreateLogTicketService"));
// import SendWhatsAppMessage from "../SendWhatsAppMessage";
const verifyAutoReplyActionTicket = (msg, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    const celularContato = ticket.contact.number;
    let celularTeste = "";
    if (ticket.autoReplyId &&
        ticket.status === "pending" &&
        !msg.fromMe &&
        !ticket.isGroup) {
        if (ticket.autoReplyId) {
            const stepAutoReplyAtual = yield (0, ShowStepAutoReplyMessageService_1.default)(0, ticket.autoReplyId, ticket.stepAutoReplyId, undefined, ticket.tenantId);
            const actionAutoReply = yield (0, VerifyActionStepAutoReplyService_1.default)(ticket.stepAutoReplyId, msg.body, ticket.tenantId);
            if (actionAutoReply) {
                yield (0, CreateAutoReplyLogsService_1.default)(stepAutoReplyAtual, ticket, msg.body);
                // action = 0: enviar para proximo step: nextStepId
                if (actionAutoReply.action === 0) {
                    yield ticket.update({
                        stepAutoReplyId: actionAutoReply.nextStepId
                    });
                    const stepAutoReply = yield (0, ShowStepAutoReplyMessageService_1.default)(0, ticket.autoReplyId, actionAutoReply.nextStepId, undefined, ticket.tenantId);
                    // Verificar se rotina em teste
                    celularTeste = stepAutoReply.autoReply.celularTeste;
                    if ((celularTeste &&
                        (celularContato === null || celularContato === void 0 ? void 0 : celularContato.indexOf(celularTeste.substr(1))) === -1) ||
                        !celularContato) {
                        if (ticket.channel !== "telegram") {
                            return;
                        }
                        // return;
                    }
                    const messageData = {
                        body: stepAutoReply.reply,
                        fromMe: true,
                        read: true,
                        sendType: "bot"
                    };
                    yield (0, CreateMessageSystemService_1.default)({
                        msg: messageData,
                        tenantId: ticket.tenantId,
                        ticket,
                        sendType: messageData.sendType,
                        status: "pending"
                    });
                    // await SetTicketMessagesAsRead(ticket);
                    return;
                }
                // action = 1: enviar para fila: queue
                if (actionAutoReply.action === 1) {
                    ticket.update({
                        queueId: actionAutoReply.queueId,
                        autoReplyId: null,
                        stepAutoReplyId: null
                    });
                    yield (0, CreateLogTicketService_1.default)({
                        ticketId: ticket.id,
                        type: "queue",
                        queueId: actionAutoReply.queueId
                    });
                }
                // action = 2: enviar para determinado usuário
                if (actionAutoReply.action === 2) {
                    ticket.update({
                        userId: actionAutoReply.userIdDestination,
                        // status: "pending",
                        autoReplyId: null,
                        stepAutoReplyId: null
                    });
                    yield (0, CreateLogTicketService_1.default)({
                        userId: actionAutoReply.userIdDestination,
                        ticketId: ticket.id,
                        type: "userDefine"
                    });
                }
                (0, socketEmit_1.default)({
                    tenantId: ticket.tenantId,
                    type: "ticket:update",
                    payload: ticket
                });
                if (actionAutoReply.replyDefinition) {
                    const messageData = {
                        body: actionAutoReply.replyDefinition,
                        fromMe: true,
                        read: true,
                        sendType: "bot"
                    };
                    yield (0, CreateMessageSystemService_1.default)({
                        msg: messageData,
                        tenantId: ticket.tenantId,
                        ticket,
                        sendType: messageData.sendType,
                        status: "pending"
                    });
                    // await SetTicketMessagesAsRead(ticket);
                }
            }
            else {
                // Verificar se rotina em teste
                celularTeste = stepAutoReplyAtual.autoReply.celularTeste;
                if ((celularTeste &&
                    (celularContato === null || celularContato === void 0 ? void 0 : celularContato.indexOf(celularTeste.substr(1))) === -1) ||
                    !celularContato) {
                    if (ticket.channel !== "telegram") {
                        return;
                    }
                    // return;
                }
                // se ticket tiver sido criado, ingnorar na primeria passagem
                if (!ticket.isCreated) {
                    const messageData = {
                        body: "Desculpe! Não entendi sua resposta. Vamos tentar novamente! Escolha uma opção válida.",
                        fromMe: true,
                        read: true,
                        sendType: "bot"
                    };
                    yield (0, CreateMessageSystemService_1.default)({
                        msg: messageData,
                        tenantId: ticket.tenantId,
                        ticket,
                        sendType: messageData.sendType,
                        status: "pending"
                    });
                }
                const messageData = {
                    body: stepAutoReplyAtual.reply,
                    fromMe: true,
                    read: true,
                    sendType: "bot"
                };
                yield (0, CreateMessageSystemService_1.default)({
                    msg: messageData,
                    tenantId: ticket.tenantId,
                    ticket,
                    sendType: messageData.sendType,
                    status: "pending"
                });
                // await SetTicketMessagesAsRead(ticket);
            }
        }
    }
});
exports.default = verifyAutoReplyActionTicket;
//# sourceMappingURL=VerifyAutoReplyActionTicket.js.map