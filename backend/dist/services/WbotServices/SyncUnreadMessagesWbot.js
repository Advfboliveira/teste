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
const Queue_1 = __importDefault(require("../../libs/Queue"));
const logger_1 = require("../../utils/logger");
const VerifyStepsChatFlowTicket_1 = __importDefault(require("../ChatFlowServices/VerifyStepsChatFlowTicket"));
const FindOrCreateTicketService_1 = __importDefault(require("../TicketServices/FindOrCreateTicketService"));
// import verifyAutoReplyActionTicket from "./helpers/VerifyAutoReplyActionTicket";
// import verifyBusinessHours from "./helpers/VerifyBusinessHours";
const VerifyContact_1 = __importDefault(require("./helpers/VerifyContact"));
const VerifyMediaMessage_1 = __importDefault(require("./helpers/VerifyMediaMessage"));
const VerifyMessage_1 = __importDefault(require("./helpers/VerifyMessage"));
const SyncUnreadMessagesWbot = (wbot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield wbot.getChats();
        yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            if (chat.unreadCount > 0) {
                const unreadMessages = yield chat.fetchMessages({
                    limit: chat.unreadCount
                });
                logger_1.logger.info(`CHAT: ${chat}`);
                if (chat.isGroup) {
                    return;
                }
                const chatContact = yield chat.getContact();
                const contact = yield (0, VerifyContact_1.default)(chatContact, tenantId);
                const ticket = yield (0, FindOrCreateTicketService_1.default)({
                    contact,
                    whatsappId: wbot.id,
                    unreadMessages: chat.unreadCount,
                    tenantId,
                    isSync: true,
                    channel: "whatsapp"
                });
                if (ticket === null || ticket === void 0 ? void 0 : ticket.isCampaignMessage) {
                    return;
                }
                if (ticket === null || ticket === void 0 ? void 0 : ticket.isFarewellMessage) {
                    return;
                }
                unreadMessages.map((msg, idx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    logger_1.logger.info(`MSG: ${msg}`, (_a = msg.id) === null || _a === void 0 ? void 0 : _a.id);
                    if (msg.hasMedia) {
                        yield (0, VerifyMediaMessage_1.default)(msg, ticket, contact);
                    }
                    else {
                        yield (0, VerifyMessage_1.default)(msg, ticket, contact);
                    }
                    // enviar mensagem do bot na ultima mensagem
                    if (idx === unreadMessages.length - 1) {
                        // await verifyAutoReplyActionTicket(msg, ticket);
                        yield (0, VerifyStepsChatFlowTicket_1.default)(msg, ticket);
                        const apiConfig = ticket.apiConfig || {};
                        if (!msg.fromMe &&
                            !ticket.isGroup &&
                            !ticket.answered &&
                            (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.externalKey) &&
                            (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.urlMessageStatus)) {
                            const payload = {
                                timestamp: Date.now(),
                                msg,
                                messageId: msg.id.id,
                                ticketId: ticket.id,
                                externalKey: apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.externalKey,
                                authToken: apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.authToken,
                                type: "hookMessage"
                            };
                            Queue_1.default.add("WebHooksAPI", {
                                url: apiConfig.urlMessageStatus,
                                type: payload.type,
                                payload
                            });
                        }
                    }
                    // await verifyBusinessHours(msg, ticket);
                }));
            }
        })));
    }
    catch (error) {
        logger_1.logger.error("Erro ao syncronizar mensagens", error);
    }
});
exports.default = SyncUnreadMessagesWbot;
//# sourceMappingURL=SyncUnreadMessagesWbot.js.map