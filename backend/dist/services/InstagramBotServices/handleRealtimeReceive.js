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
const VerifyStepsChatFlowTicket_1 = __importDefault(require("../ChatFlowServices/VerifyStepsChatFlowTicket"));
const FindOrCreateTicketService_1 = __importDefault(require("../TicketServices/FindOrCreateTicketService"));
const VerifyBusinessHours_1 = __importDefault(require("../WbotServices/helpers/VerifyBusinessHours"));
const ShowWhatsAppService_1 = __importDefault(require("../WhatsappService/ShowWhatsAppService"));
const InstagramVerifyContact_1 = __importDefault(require("./InstagramVerifyContact"));
const InstagramVerifyMediaMessage_1 = __importDefault(require("./InstagramVerifyMediaMessage"));
const InstagramVerifyMessage_1 = __importDefault(require("./InstagramVerifyMessage"));
const handleRealtimeReceive = (ctx, instaBot) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const channel = yield (0, ShowWhatsAppService_1.default)({ id: instaBot.id });
    const threadData = yield instaBot.feed
        .directThread({ thread_id: ctx.message.thread_id, oldest_cursor: "" })
        .request();
    const contact = yield (0, InstagramVerifyContact_1.default)(threadData, instaBot, channel.tenantId);
    const account = instaBot === null || instaBot === void 0 ? void 0 : instaBot.accountLogin;
    const fromMe = (account === null || account === void 0 ? void 0 : account.pk) === ctx.message.user_id;
    const ticket = yield (0, FindOrCreateTicketService_1.default)({
        contact,
        whatsappId: instaBot.id,
        unreadMessages: fromMe ? 0 : 1,
        tenantId: channel.tenantId,
        msg: Object.assign(Object.assign({}, ctx.message), { fromMe }),
        channel: "instagram"
    });
    if (ticket === null || ticket === void 0 ? void 0 : ticket.isFarewellMessage) {
        return;
    }
    if (ctx.message.item_type !== "text") {
        yield (0, InstagramVerifyMediaMessage_1.default)(ctx, fromMe, ticket, contact);
    }
    else {
        yield (0, InstagramVerifyMessage_1.default)(ctx, fromMe, ticket, contact);
    }
    // marcar como lida
    const entity = yield instaBot.entity.directThread(ctx.message.thread_id);
    entity.markItemSeen(ctx.message.item_id);
    yield (0, VerifyStepsChatFlowTicket_1.default)({
        fromMe,
        body: ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || ""
    }, ticket);
    yield (0, VerifyBusinessHours_1.default)({
        fromMe,
        timestamp: ctx.message.timestamp / 1000 // adequar horário node
    }, ticket);
});
exports.default = handleRealtimeReceive;
//# sourceMappingURL=handleRealtimeReceive.js.map