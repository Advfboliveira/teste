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
const path_1 = require("path");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const content_disposition_1 = __importDefault(require("content-disposition"));
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const getQuotedForMessageId_1 = __importDefault(require("../../helpers/getQuotedForMessageId"));
const downloadFile = (url, filename) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const request = yield (0, axios_1.default)({
        url,
        method: "GET",
        responseType: "stream"
    });
    const parseDisposition = request.headers["content-disposition"]
        ? content_disposition_1.default.parse(request.headers["content-disposition"] || "")
        : { parameters: {} };
    let name = "";
    const filenameExists = (_a = parseDisposition === null || parseDisposition === void 0 ? void 0 : parseDisposition.parameters) === null || _a === void 0 ? void 0 : _a.filename;
    if (filenameExists) {
        const fileName = parseDisposition.parameters.filename;
        name = `${new Date().getTime()}-${fileName}`;
    }
    else {
        const contentType = request.headers["content-type"];
        const ext = contentType.split("/")[1];
        name = `${filename}-${new Date().getTime()}.${ext}`;
    }
    const pathFile = (0, path_1.join)(__dirname, "..", "..", "..", "public", name);
    yield new Promise((resolve, reject) => {
        request.data
            .pipe((0, fs_1.createWriteStream)(pathFile))
            .on("finish", () => __awaiter(void 0, void 0, void 0, function* () { return resolve(name); }))
            .on("error", (error) => {
            console.error("ERROR DONWLOAD", error);
            // fs.rmdirSync(mediaDir, { recursive: true });
            reject(new Error(error));
        });
    });
    return name;
});
const MessengerVerifyMediaMessage = (channel, msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    // const quotedMsg = await VerifyQuotedMessage(msg);
    let filename;
    yield Promise.all(msg.message.attachments.map((item, idx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c, _d, _e;
        const name = `${ticket.id}_${msg.message_id}`;
        filename = yield downloadFile(item.payload.url, name);
        let quotedMsgId;
        if ((_c = (_b = msg === null || msg === void 0 ? void 0 : msg.message) === null || _b === void 0 ? void 0 : _b.reply_to) === null || _c === void 0 ? void 0 : _c.mid) {
            const messageQuoted = yield (0, getQuotedForMessageId_1.default)(msg.message.reply_to.mid, ticket.tenantId);
            quotedMsgId = (messageQuoted === null || messageQuoted === void 0 ? void 0 : messageQuoted.id) || undefined;
        }
        const messageData = {
            // idx necessário em função do id ser o mesmo para todos os anexos
            messageId: idx > 0 ? `${msg.message_id}__${idx}` : msg.message_id || "",
            ticketId: ticket.id,
            contactId: contact.id,
            body: ((_d = msg.message) === null || _d === void 0 ? void 0 : _d.text) || "",
            fromMe: msg.fromMe,
            read: false,
            mediaUrl: filename,
            mediaType: msg.type,
            quotedMsgId,
            timestamp: +msg.timestamp,
            status: "received"
        };
        yield ticket.update({
            lastMessage: ((_e = msg.message) === null || _e === void 0 ? void 0 : _e.text) || filename || "",
            lastMessageAt: new Date().getTime(),
            answered: false
        });
        yield (0, CreateMessageService_1.default)({
            messageData,
            tenantId: ticket.tenantId
        });
        // return newMessage;
    })));
});
exports.default = MessengerVerifyMediaMessage;
//# sourceMappingURL=MessengerVerifyMediaMessage.js.map