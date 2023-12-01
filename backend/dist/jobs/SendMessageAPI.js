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
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("../utils/logger");
const wbot_1 = require("../libs/wbot");
const Queue_1 = __importDefault(require("../libs/Queue"));
const VerifyContact_1 = __importDefault(require("../services/WbotServices/helpers/VerifyContact"));
const FindOrCreateTicketService_1 = __importDefault(require("../services/TicketServices/FindOrCreateTicketService"));
const CreateMessageSystemService_1 = __importDefault(require("../services/MessageServices/CreateMessageSystemService"));
exports.default = {
    key: "SendMessageAPI",
    options: {
        delay: 6000,
        attempts: 50,
        removeOnComplete: true,
        removeOnFail: false,
        backoff: {
            type: "fixed",
            delay: 60000 * 3 // 3 min
        }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handle({ data }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wbot = (0, wbot_1.getWbot)(data.sessionId);
                const message = {};
                try {
                    const idNumber = yield wbot.getNumberId(data.number);
                    if (!idNumber) {
                        const payload = {
                            ack: -1,
                            body: data.body,
                            messageId: "",
                            number: data.number,
                            externalKey: data.externalKey,
                            error: "number invalid in whatsapp",
                            type: "hookMessageStatus",
                            authToken: data.authToken
                        };
                        if (data.media) {
                            // excluir o arquivo se o número não existir
                            fs_1.default.unlinkSync(data.media.path);
                        }
                        if ((_a = data === null || data === void 0 ? void 0 : data.apiConfig) === null || _a === void 0 ? void 0 : _a.urlMessageStatus) {
                            Queue_1.default.add("WebHooksAPI", {
                                url: data.apiConfig.urlMessageStatus,
                                type: payload.type,
                                payload
                            });
                        }
                        return payload;
                    }
                    // '559891191708@c.us'
                    const msgContact = yield wbot.getContactById(idNumber._serialized);
                    const contact = yield (0, VerifyContact_1.default)(msgContact, data.tenantId);
                    const ticket = yield (0, FindOrCreateTicketService_1.default)({
                        contact,
                        whatsappId: wbot.id,
                        unreadMessages: 0,
                        tenantId: data.tenantId,
                        groupContact: undefined,
                        msg: data,
                        channel: "whatsapp"
                    });
                    yield (0, CreateMessageSystemService_1.default)({
                        msg: data,
                        tenantId: data.tenantId,
                        ticket,
                        sendType: "API",
                        status: "pending"
                    });
                    yield ticket.update({
                        apiConfig: Object.assign(Object.assign({}, data.apiConfig), { externalKey: data.externalKey })
                    });
                }
                catch (error) {
                    const payload = {
                        ack: -2,
                        body: data.body,
                        messageId: "",
                        number: data.number,
                        externalKey: data.externalKey,
                        error: "error session",
                        type: "hookMessageStatus",
                        authToken: data.authToken
                    };
                    if ((_b = data === null || data === void 0 ? void 0 : data.apiConfig) === null || _b === void 0 ? void 0 : _b.urlMessageStatus) {
                        Queue_1.default.add("WebHooksAPI", {
                            url: data.apiConfig.urlMessageStatus,
                            type: payload.type,
                            payload
                        });
                    }
                    throw new Error(error);
                }
                // const apiMessage = await UpsertMessageAPIService({
                //   sessionId: data.sessionId,
                //   messageId: message.id.id,
                //   body: data.body,
                //   ack: message.ack,
                //   number: data.number,
                //   mediaName: data?.media?.filename,
                //   mediaUrl: data.mediaUrl,
                //   timestamp: message.timestamp,
                //   externalKey: data.externalKey,
                //   messageWA: message,
                //   apiConfig: data.apiConfig,
                //   tenantId: data.tenantId
                // });
            }
            catch (error) {
                logger_1.logger.error({ message: "Error send message api", error });
                throw new Error(error);
            }
        });
    }
};
//# sourceMappingURL=SendMessageAPI.js.map