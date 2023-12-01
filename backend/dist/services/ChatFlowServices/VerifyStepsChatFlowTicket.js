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
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
// import { sleepRandomTime } from "../../../utils/sleepRandomTime";
// import CreateAutoReplyLogsService from "../AutoReplyServices/CreateAutoReplyLogsService";
const CreateMessageSystemService_1 = __importDefault(require("../MessageServices/CreateMessageSystemService"));
const CreateLogTicketService_1 = __importDefault(require("../TicketServices/CreateLogTicketService"));
const BuildSendMessageService_1 = __importDefault(require("./BuildSendMessageService"));
const DefinedUserBotService_1 = __importDefault(require("./DefinedUserBotService"));
// import SendWhatsAppMessage from "../SendWhatsAppMessage";
const IsContactTest_1 = __importDefault(require("./IsContactTest"));
const isNextSteps = (ticket, chatFlow, step, stepCondition) => __awaiter(void 0, void 0, void 0, function* () {
    // action = 0: enviar para proximo step: nextStepId
    if (stepCondition.action === 0) {
        yield ticket.update({
            stepChatFlow: stepCondition.nextStepId,
            botRetries: 0,
            lastInteractionBot: new Date()
        });
        const nodesList = [...chatFlow.flow.nodeList];
        /// pegar os dados do proxumo step
        const nextStep = nodesList.find((n) => n.id === stepCondition.nextStepId);
        if (!nextStep)
            return;
        for (const interaction of nextStep.interactions) {
            yield (0, BuildSendMessageService_1.default)({
                msg: interaction,
                tenantId: ticket.tenantId,
                ticket
            });
        }
        // await SetTicketMessagesAsRead(ticket);
    }
});
const isQueueDefine = (ticket, flowConfig, step, stepCondition) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // action = 1: enviar para fila: queue
    if (stepCondition.action === 1) {
        ticket.update({
            queueId: stepCondition.queueId,
            chatFlowId: null,
            stepChatFlow: null,
            botRetries: 0,
            lastInteractionBot: new Date()
        });
        yield (0, CreateLogTicketService_1.default)({
            ticketId: ticket.id,
            type: "queue",
            queueId: stepCondition.queueId
        });
        if ((_a = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _a === void 0 ? void 0 : _a.autoDistributeTickets) {
            (0, DefinedUserBotService_1.default)(ticket, stepCondition.queueId, ticket.tenantId, (_b = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _b === void 0 ? void 0 : _b.autoDistributeTickets);
        }
    }
});
const isUserDefine = (ticket, step, stepCondition) => __awaiter(void 0, void 0, void 0, function* () {
    // action = 2: enviar para determinado usuário
    if (stepCondition.action === 2) {
        ticket.update({
            userId: stepCondition.userIdDestination,
            // status: "pending",
            chatFlowId: null,
            stepChatFlow: null,
            botRetries: 0,
            lastInteractionBot: new Date()
        });
        yield (0, CreateLogTicketService_1.default)({
            userId: stepCondition.userIdDestination,
            ticketId: ticket.id,
            type: "userDefine"
        });
    }
});
// enviar mensagem de boas vindas à fila ou usuário
const sendWelcomeMessage = (ticket, flowConfig) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    if ((_d = (_c = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _c === void 0 ? void 0 : _c.welcomeMessage) === null || _d === void 0 ? void 0 : _d.message) {
        const messageData = {
            body: (_e = flowConfig.configurations) === null || _e === void 0 ? void 0 : _e.welcomeMessage.message,
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
});
const isRetriesLimit = (ticket, flowConfig) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    // verificar o limite de retentativas e realizar ação
    const maxRetryNumber = (_g = (_f = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _f === void 0 ? void 0 : _f.maxRetryBotMessage) === null || _g === void 0 ? void 0 : _g.number;
    if (((_h = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _h === void 0 ? void 0 : _h.maxRetryBotMessage) &&
        maxRetryNumber &&
        ticket.botRetries >= maxRetryNumber - 1) {
        const destinyType = flowConfig.configurations.maxRetryBotMessage.type;
        const { destiny } = flowConfig.configurations.maxRetryBotMessage;
        const updatedValues = {
            chatFlowId: null,
            stepChatFlow: null,
            botRetries: 0,
            lastInteractionBot: new Date()
        };
        const logsRetry = {
            ticketId: ticket.id,
            type: destinyType === 1 ? "retriesLimitQueue" : "retriesLimitUserDefine"
        };
        // enviar para fila
        if (destinyType === 1) {
            updatedValues.queueId = destiny;
            logsRetry.queueId = destiny;
        }
        // enviar para usuario
        if (destinyType === 2) {
            updatedValues.userId = destiny;
            logsRetry.userId = destiny;
        }
        ticket.update(updatedValues);
        yield (0, CreateLogTicketService_1.default)(logsRetry);
        (0, socketEmit_1.default)({
            tenantId: ticket.tenantId,
            type: "ticket:update",
            payload: ticket
        });
        // enviar mensagem de boas vindas à fila ou usuário
        yield sendWelcomeMessage(ticket, flowConfig);
        return true;
    }
    return false;
});
const isAnswerCloseTicket = (flowConfig, ticket, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    if (!((_j = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _j === void 0 ? void 0 : _j.answerCloseTicket) ||
        ((_l = (_k = flowConfig === null || flowConfig === void 0 ? void 0 : flowConfig.configurations) === null || _k === void 0 ? void 0 : _k.answerCloseTicket) === null || _l === void 0 ? void 0 : _l.length) < 1) {
        return false;
    }
    // verificar condição com a ação
    const params = flowConfig.configurations.answerCloseTicket.find((condition) => {
        return (String(condition).toLowerCase().trim() ===
            String(message).toLowerCase().trim());
    });
    if (params) {
        yield ticket.update({
            chatFlowId: null,
            stepChatFlow: null,
            botRetries: 0,
            lastInteractionBot: new Date(),
            unreadMessages: 0,
            answered: false,
            status: "closed"
        });
        yield (0, CreateLogTicketService_1.default)({
            ticketId: ticket.id,
            type: "autoClose"
        });
        (0, socketEmit_1.default)({
            tenantId: ticket.tenantId,
            type: "ticket:update",
            payload: ticket
        });
        return true;
    }
    return false;
});
const VerifyStepsChatFlowTicket = (msg, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    let celularTeste; // ticket.chatFlow?.celularTeste;
    if (ticket.chatFlowId &&
        ticket.status === "pending" &&
        !msg.fromMe &&
        !ticket.isGroup &&
        !ticket.answered) {
        if (ticket.chatFlowId) {
            const chatFlow = yield ticket.getChatFlow();
            if (chatFlow.celularTeste) {
                celularTeste = chatFlow.celularTeste.replace(/\s/g, ""); // retirar espaços
            }
            const step = chatFlow.flow.nodeList.find((node) => node.id === ticket.stepChatFlow);
            const flowConfig = chatFlow.flow.nodeList.find((node) => node.type === "configurations");
            // verificar condição com a ação do step
            const stepCondition = step.conditions.find((conditions) => {
                const newConditions = conditions.condition.map((c) => String(c).toLowerCase().trim());
                const message = String(msg.body).toLowerCase().trim();
                return newConditions.includes(message);
            });
            if (!ticket.isCreated &&
                (yield isAnswerCloseTicket(flowConfig, ticket, msg.body)))
                return;
            if (stepCondition && !ticket.isCreated) {
                // await CreateAutoReplyLogsService(stepAutoReplyAtual, ticket, msg.body);
                // Verificar se rotina em teste
                if (yield (0, IsContactTest_1.default)(ticket.contact.number, celularTeste, ticket.channel))
                    return;
                // action = 0: enviar para proximo step: nextStepId
                yield isNextSteps(ticket, chatFlow, step, stepCondition);
                // action = 1: enviar para fila: queue
                yield isQueueDefine(ticket, flowConfig, step, stepCondition);
                // action = 2: enviar para determinado usuário
                yield isUserDefine(ticket, step, stepCondition);
                (0, socketEmit_1.default)({
                    tenantId: ticket.tenantId,
                    type: "ticket:update",
                    payload: ticket
                });
                if (stepCondition.action === 1 || stepCondition.action === 2) {
                    yield sendWelcomeMessage(ticket, flowConfig);
                }
            }
            else {
                // Verificar se rotina em teste
                if (yield (0, IsContactTest_1.default)(ticket.contact.number, celularTeste, ticket.channel))
                    return;
                // se ticket tiver sido criado, ingnorar na primeria passagem
                if (!ticket.isCreated) {
                    if (yield isRetriesLimit(ticket, flowConfig))
                        return;
                    const messageData = {
                        body: flowConfig.configurations.notOptionsSelectMessage.message ||
                            "Desculpe! Não entendi sua resposta. Vamos tentar novamente! Escolha uma opção válida.",
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
                    // tratar o número de retentativas do bot
                    yield ticket.update({
                        botRetries: ticket.botRetries + 1,
                        lastInteractionBot: new Date()
                    });
                }
                for (const interaction of step.interactions) {
                    yield (0, BuildSendMessageService_1.default)({
                        msg: interaction,
                        tenantId: ticket.tenantId,
                        ticket
                    });
                }
            }
            // await SetTicketMessagesAsRead(ticket);
            // await SetTicketMessagesAsRead(ticket);
        }
    }
});
exports.default = VerifyStepsChatFlowTicket;
//# sourceMappingURL=VerifyStepsChatFlowTicket.js.map