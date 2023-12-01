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
const logger_1 = require("../../utils/logger");
const FindOrCreateTicketService_1 = __importDefault(require("../TicketServices/FindOrCreateTicketService"));
const messengerBot_1 = require("../../libs/messengerBot");
const MessengerVerifyContact_1 = __importDefault(require("./MessengerVerifyContact"));
const MessengerVerifyMessage_1 = __importDefault(require("./MessengerVerifyMessage"));
const MessengerVerifyMediaMessage_1 = __importDefault(require("./MessengerVerifyMediaMessage"));
const VerifyStepsChatFlowTicket_1 = __importDefault(require("../ChatFlowServices/VerifyStepsChatFlowTicket"));
const MessengerMarkRead_1 = __importDefault(require("./MessengerMarkRead"));
const MessengerShowChannel_1 = __importDefault(require("./MessengerShowChannel"));
const VerifyBusinessHours_1 = __importDefault(require("../WbotServices/helpers/VerifyBusinessHours"));
// eslint-disable-next-line consistent-return
const getMessageType = (message) => {
    const { attachments } = message;
    const hasAttachment = attachments && attachments.length > 0;
    if (message.text && !hasAttachment)
        return "text";
    if (hasAttachment && attachments[0].type === "image")
        return "image";
    if (hasAttachment && attachments[0].type === "audio")
        return "audio";
    if (hasAttachment && attachments[0].type === "video")
        return "video";
    if (hasAttachment && attachments[0].type === "location")
        return "location";
    if (hasAttachment && attachments[0].type === "file")
        return "file";
    if (hasAttachment && attachments[0].type === "fallback")
        return "fallback";
};
const MessengerHandleMessage = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            let channel;
            let contact;
            const unreadMessages = 1;
            try {
                if (context.object !== "page")
                    return;
                const entry = context.entry.shift();
                const messageObj = entry === null || entry === void 0 ? void 0 : entry.messaging.shift();
                channel = yield (0, MessengerShowChannel_1.default)({ fbPageId: entry.id });
                if (!channel)
                    return;
                const messagerBot = yield (0, messengerBot_1.getMessengerBot)(channel.id);
                if (!(messageObj === null || messageObj === void 0 ? void 0 : messageObj.message) && messageObj.read) {
                    // criar lógica para leitura ack
                    (0, MessengerMarkRead_1.default)(messageObj, channel.tenantId);
                    return;
                }
                contact = yield (0, MessengerVerifyContact_1.default)(messageObj.sender, messagerBot, channel.tenantId);
                const msgData = Object.assign(Object.assign({}, messageObj), { type: getMessageType(messageObj.message), fromMe: false, body: ((_a = messageObj === null || messageObj === void 0 ? void 0 : messageObj.message) === null || _a === void 0 ? void 0 : _a.text) || "", timestamp: messageObj.timestamp, message_id: messageObj.message.mid });
                const ticket = yield (0, FindOrCreateTicketService_1.default)({
                    contact,
                    whatsappId: channel.id,
                    unreadMessages,
                    tenantId: channel.tenantId,
                    msg: msgData,
                    channel: "messenger"
                });
                if (ticket === null || ticket === void 0 ? void 0 : ticket.isCampaignMessage) {
                    resolve();
                    return;
                }
                if (ticket === null || ticket === void 0 ? void 0 : ticket.isFarewellMessage) {
                    resolve();
                    return;
                }
                if (msgData.type !== "text") {
                    yield (0, MessengerVerifyMediaMessage_1.default)(channel, msgData, ticket, contact);
                    // await VerifyMediaMessage360(channel, msgData, ticket, contact);
                }
                else {
                    yield (0, MessengerVerifyMessage_1.default)(msgData, ticket, contact);
                }
                yield (0, VerifyStepsChatFlowTicket_1.default)(msgData, ticket);
                yield (0, VerifyBusinessHours_1.default)(msgData, ticket);
                resolve();
            }
            catch (error) {
                logger_1.logger.error(error);
                reject(error);
            }
        }))();
    });
});
exports.default = MessengerHandleMessage;
//# sourceMappingURL=MessengerHandleMessage.js.map