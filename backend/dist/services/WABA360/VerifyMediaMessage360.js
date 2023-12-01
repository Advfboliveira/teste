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
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const GetMediaWaba360_1 = __importDefault(require("./GetMediaWaba360"));
const VerifyMediaMessage = (channel, msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // const quotedMsg = await VerifyQuotedMessage(msg);
    let filename;
    try {
        filename = yield (0, GetMediaWaba360_1.default)({ channel, msg, ticket });
    }
    catch (error) { }
    // if (!filename) {
    //   throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    // }
    let wabaMediaId;
    if (!["text", "chat", "template"].includes(msg.type)) {
        const msgData = msg;
        wabaMediaId = msgData[msg.type].id;
    }
    const messageData = {
        messageId: msg.id || "",
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: ((_a = msg === null || msg === void 0 ? void 0 : msg.text) === null || _a === void 0 ? void 0 : _a.body) || filename || "",
        fromMe: msg.fromMe,
        read: msg.fromMe,
        mediaUrl: filename,
        mediaType: msg.type,
        // quotedMsgId: undefind || quotedMsg?.id,
        timestamp: +msg.timestamp,
        wabaMediaId,
        status: msg.fromMe ? "sended" : "received"
    };
    yield ticket.update({
        lastMessage: ((_b = msg === null || msg === void 0 ? void 0 : msg.text) === null || _b === void 0 ? void 0 : _b.body) || filename,
        lastMessageAt: new Date().getTime(),
        answered: msg.fromMe || false
    });
    const newMessage = yield (0, CreateMessageService_1.default)({
        messageData,
        tenantId: ticket.tenantId
    });
    return newMessage;
});
exports.default = VerifyMediaMessage;
//# sourceMappingURL=VerifyMediaMessage360.js.map