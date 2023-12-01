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
const ShowWhatsAppService_1 = __importDefault(require("../WhatsappService/ShowWhatsAppService"));
const TelegramVerifyContact_1 = __importDefault(require("./TelegramVerifyContact"));
const FindOrCreateTicketService_1 = __importDefault(require("../TicketServices/FindOrCreateTicketService"));
const TelegramVerifyMediaMessage_1 = __importDefault(require("./TelegramVerifyMediaMessage"));
const TelegramVerifyMessage_1 = __importDefault(require("./TelegramVerifyMessage"));
const VerifyBusinessHours_1 = __importDefault(require("../WbotServices/helpers/VerifyBusinessHours"));
const VerifyStepsChatFlowTicket_1 = __importDefault(require("../ChatFlowServices/VerifyStepsChatFlowTicket"));
const HandleMessage = (ctx, tbot) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const channel = yield (0, ShowWhatsAppService_1.default)({ id: tbot.id });
    let message;
    let updateMessage = {};
    // const { message, update }: any = ctx;
    message = ctx === null || ctx === void 0 ? void 0 : ctx.message;
    updateMessage = ctx === null || ctx === void 0 ? void 0 : ctx.update;
    // Verificar se mensagem foi editada.
    if (!message && updateMessage) {
        message = updateMessage === null || updateMessage === void 0 ? void 0 : updateMessage.edited_message;
    }
    const chat = message === null || message === void 0 ? void 0 : message.chat;
    const me = yield ctx.telegram.getMe();
    const fromMe = me.id === ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from.id);
    const messageData = Object.assign(Object.assign({}, message), { 
        // compatibilizar timestamp com js
        timestamp: +message.date * 1000 });
    const contact = yield (0, TelegramVerifyContact_1.default)(ctx, channel.tenantId);
    const ticket = yield (0, FindOrCreateTicketService_1.default)({
        contact,
        whatsappId: tbot.id,
        unreadMessages: fromMe ? 0 : 1,
        tenantId: channel.tenantId,
        msg: Object.assign(Object.assign({}, messageData), { fromMe }),
        channel: "telegram"
    });
    if (ticket === null || ticket === void 0 ? void 0 : ticket.isFarewellMessage) {
        return;
    }
    if (!(messageData === null || messageData === void 0 ? void 0 : messageData.text) && (chat === null || chat === void 0 ? void 0 : chat.id)) {
        yield (0, TelegramVerifyMediaMessage_1.default)(ctx, fromMe, ticket, contact);
    }
    else {
        yield (0, TelegramVerifyMessage_1.default)(ctx, fromMe, ticket, contact);
    }
    yield (0, VerifyStepsChatFlowTicket_1.default)({
        fromMe,
        body: message.text || ""
    }, ticket);
    yield (0, VerifyBusinessHours_1.default)({
        fromMe,
        timestamp: messageData.timestamp
    }, ticket);
    // const unreadMessages = fromMe ? 0 : chat.unreadCount;
    // console.log("ctx", Context);
});
exports.default = HandleMessage;
//# sourceMappingURL=HandleMessageTelegram.js.map