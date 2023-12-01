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
const ShowWhatsAppService_1 = __importDefault(require("../WhatsappService/ShowWhatsAppService"));
const VerifyContactWaba360_1 = __importDefault(require("./VerifyContactWaba360"));
const VerifyMediaMessage360_1 = __importDefault(require("./VerifyMediaMessage360"));
const VerifyMessage360_1 = __importDefault(require("./VerifyMessage360"));
const HandleMessage360 = (context, channelId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            let channel;
            let contact;
            const unreadMessages = 1;
            try {
                channel = yield (0, ShowWhatsAppService_1.default)({ id: channelId });
                contact = yield (0, VerifyContactWaba360_1.default)(context.contacts[0], channel.tenantId);
                const msgData = Object.assign(Object.assign({}, context.messages[0]), { fromMe: false, message_id: context.messages[0].id });
                const ticket = yield (0, FindOrCreateTicketService_1.default)({
                    contact,
                    whatsappId: channel.id,
                    unreadMessages,
                    tenantId: channel.tenantId,
                    msg: msgData,
                    channel: "waba"
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
                    yield (0, VerifyMediaMessage360_1.default)(channel, msgData, ticket, contact);
                }
                else {
                    yield (0, VerifyMessage360_1.default)(msgData, ticket, contact);
                }
                // await VerifyStepsChatFlowTicket(msgData, ticket);
                // await verifyBusinessHours(msgData, ticket);
                resolve();
            }
            catch (error) {
                logger_1.logger.error(error);
                reject(error);
            }
        }))();
    });
});
exports.default = HandleMessage360;
//# sourceMappingURL=HandleMessage360.js.map