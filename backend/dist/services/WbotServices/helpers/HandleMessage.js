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
const logger_1 = require("../../../utils/logger");
const FindOrCreateTicketService_1 = __importDefault(require("../../TicketServices/FindOrCreateTicketService"));
const ShowWhatsAppService_1 = __importDefault(require("../../WhatsappService/ShowWhatsAppService"));
const IsValidMsg_1 = __importDefault(require("./IsValidMsg"));
// import VerifyAutoReplyActionTicket from "./VerifyAutoReplyActionTicket";
const VerifyContact_1 = __importDefault(require("./VerifyContact"));
const VerifyMediaMessage_1 = __importDefault(require("./VerifyMediaMessage"));
const VerifyMessage_1 = __importDefault(require("./VerifyMessage"));
const VerifyBusinessHours_1 = __importDefault(require("./VerifyBusinessHours"));
const VerifyStepsChatFlowTicket_1 = __importDefault(require("../../ChatFlowServices/VerifyStepsChatFlowTicket"));
const Queue_1 = __importDefault(require("../../../libs/Queue"));
// import isMessageExistsService from "../../MessageServices/isMessageExistsService";
const Setting_1 = __importDefault(require("../../../models/Setting"));
const HandleMessage = (msg, wbot) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            if (!(0, IsValidMsg_1.default)(msg)) {
                return;
            }
            let whatsapp;
            whatsapp = yield (0, ShowWhatsAppService_1.default)({ id: wbot.id });
            const { tenantId } = whatsapp;
            // IGNORAR MENSAGENS DE GRUPO
            const Settingdb = yield Setting_1.default.findOne({
                where: { key: "ignoreGroupMsg", tenantId }
            });
            if ((Settingdb === null || Settingdb === void 0 ? void 0 : Settingdb.value) == "enabled") {
                if (msg.from === "status@broadcast" || msg.author != null) {
                    return;
                }
            }
            // IGNORAR MENSAGENS DE GRUPO
            try {
                let msgContact;
                let groupContact;
                if (msg.fromMe) {
                    // media messages sent from me from cell phone, first comes with "hasMedia = false" and type = "image/ptt/etc"
                    // the media itself comes on body of message, as base64
                    // if this is the case, return and let this media be handled by media_uploaded event
                    // it should be improoved to handle the base64 media here in future versions
                    if (!msg.hasMedia && msg.type !== "chat" && msg.type !== "vcard")
                        return;
                    msgContact = yield wbot.getContactById(msg.to);
                }
                else {
                    msgContact = yield msg.getContact();
                }
                const chat = yield msg.getChat();
                if (chat.isGroup) {
                    let msgGroupContact;
                    if (msg.fromMe) {
                        msgGroupContact = yield wbot.getContactById(msg.to);
                    }
                    else {
                        msgGroupContact = yield wbot.getContactById(msg.from);
                    }
                    groupContact = yield (0, VerifyContact_1.default)(msgGroupContact, tenantId);
                }
                const unreadMessages = msg.fromMe ? 0 : chat.unreadCount;
                // const profilePicUrl = await msgContact.getProfilePicUrl();
                const contact = yield (0, VerifyContact_1.default)(msgContact, tenantId);
                const ticket = yield (0, FindOrCreateTicketService_1.default)({
                    contact,
                    whatsappId: wbot.id,
                    unreadMessages,
                    tenantId,
                    groupContact,
                    msg,
                    channel: "whatsapp"
                });
                if (ticket === null || ticket === void 0 ? void 0 : ticket.isCampaignMessage) {
                    resolve();
                    return;
                }
                if (ticket === null || ticket === void 0 ? void 0 : ticket.isFarewellMessage) {
                    resolve();
                    return;
                }
                if (msg.hasMedia) {
                    yield (0, VerifyMediaMessage_1.default)(msg, ticket, contact);
                }
                else {
                    yield (0, VerifyMessage_1.default)(msg, ticket, contact);
                }
                const isBusinessHours = yield (0, VerifyBusinessHours_1.default)(msg, ticket);
                // await VerifyAutoReplyActionTicket(msg, ticket);
                if (isBusinessHours)
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
                resolve();
            }
            catch (err) {
                logger_1.logger.error(err);
                reject(err);
            }
        }))();
    });
});
exports.default = HandleMessage;
//# sourceMappingURL=HandleMessage.js.map