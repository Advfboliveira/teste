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
const ApiMessage_1 = __importDefault(require("../../models/ApiMessage"));
const UpsertMessageAPIService = ({ sessionId, messageId, body, ack, number, mediaName, mediaUrl, timestamp, externalKey, messageWA, apiConfig, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    let message;
    const messageExists = yield ApiMessage_1.default.findOne({
        where: { messageId, tenantId }
    });
    if (messageExists) {
        yield messageExists.update({
            sessionId,
            messageId,
            body,
            ack,
            number,
            mediaName,
            mediaUrl,
            timestamp,
            externalKey,
            messageWA,
            apiConfig,
            tenantId
        });
        message = yield messageExists.reload();
    }
    else {
        message = yield ApiMessage_1.default.create({
            sessionId,
            messageId,
            body,
            ack,
            number,
            mediaName,
            mediaUrl,
            timestamp,
            externalKey,
            messageWA,
            apiConfig,
            tenantId
        });
    }
    if (!message) {
        // throw new AppError("ERR_CREATING_MESSAGE", 501);
        throw new Error("ERR_CREATING_MESSAGE");
    }
    return message;
});
exports.default = UpsertMessageAPIService;
//# sourceMappingURL=UpsertMessageAPIService.js.map