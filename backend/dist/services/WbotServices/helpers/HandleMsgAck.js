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
const Message_1 = __importDefault(require("../../../models/Message"));
const Ticket_1 = __importDefault(require("../../../models/Ticket"));
const logger_1 = require("../../../utils/logger");
const CampaignContacts_1 = __importDefault(require("../../../models/CampaignContacts"));
const ApiMessage_1 = __importDefault(require("../../../models/ApiMessage"));
const socketEmit_1 = __importDefault(require("../../../helpers/socketEmit"));
const Queue_1 = __importDefault(require("../../../libs/Queue"));
const HandleMsgAck = (msg, ack) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(r => setTimeout(r, 500));
    try {
        const messageToUpdate = yield Message_1.default.findOne({
            where: { messageId: msg.id.id },
            include: [
                "contact",
                {
                    model: Ticket_1.default,
                    as: "ticket",
                    attributes: ["id", "tenantId", "apiConfig"]
                },
                {
                    model: Message_1.default,
                    as: "quotedMsg",
                    include: ["contact"]
                }
            ]
        });
        if (messageToUpdate) {
            yield messageToUpdate.update({ ack });
            const { ticket } = messageToUpdate;
            (0, socketEmit_1.default)({
                tenantId: ticket.tenantId,
                type: "chat:ack",
                payload: messageToUpdate
            });
            const apiConfig = ticket.apiConfig || {};
            if ((apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.externalKey) && (apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.urlMessageStatus)) {
                const payload = {
                    ack,
                    messageId: msg.id.id,
                    ticketId: ticket.id,
                    externalKey: apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.externalKey,
                    authToken: apiConfig === null || apiConfig === void 0 ? void 0 : apiConfig.authToken,
                    type: "hookMessageStatus"
                };
                Queue_1.default.add("WebHooksAPI", {
                    url: apiConfig.urlMessageStatus,
                    type: payload.type,
                    payload
                });
            }
        }
        const messageAPI = yield ApiMessage_1.default.findOne({
            where: { messageId: msg.id.id }
        });
        if (messageAPI) {
            yield messageAPI.update({ ack });
        }
        const messageCampaign = yield CampaignContacts_1.default.findOne({
            where: { messageId: msg.id.id }
        });
        if (messageCampaign) {
            yield messageCampaign.update({ ack });
        }
    }
    catch (err) {
        logger_1.logger.error(err);
    }
});
exports.default = HandleMsgAck;
//# sourceMappingURL=HandleMsgAck.js.map