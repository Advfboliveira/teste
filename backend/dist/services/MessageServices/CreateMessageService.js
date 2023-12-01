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
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const CreateMessageService = ({ messageData, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = yield Message_1.default.findOne({
        where: { messageId: messageData.messageId, tenantId }
    });
    if (!msg) {
        yield Message_1.default.create(Object.assign(Object.assign({}, messageData), { tenantId }));
    }
    else {
        yield msg.update(messageData);
    }
    const message = yield Message_1.default.findOne({
        where: { messageId: messageData.messageId, tenantId },
        include: [
            {
                model: Ticket_1.default,
                as: "ticket",
                where: { tenantId },
                include: ["contact"]
            },
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ]
    });
    if (!message) {
        // throw new AppError("ERR_CREATING_MESSAGE", 501);
        throw new Error("ERR_CREATING_MESSAGE");
    }
    (0, socketEmit_1.default)({
        tenantId,
        type: "chat:create",
        payload: message
    });
    return message;
});
exports.default = CreateMessageService;
//# sourceMappingURL=CreateMessageService.js.map