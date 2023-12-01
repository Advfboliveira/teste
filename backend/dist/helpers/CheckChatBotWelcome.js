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
const Contact_1 = __importDefault(require("../models/Contact"));
const ShowStepAutoReplyMessageService_1 = __importDefault(require("../services/AutoReplyServices/ShowStepAutoReplyMessageService"));
const CreateLogTicketService_1 = __importDefault(require("../services/TicketServices/CreateLogTicketService"));
const AutoReplyWelcome = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (instance.userId || instance.isGroup)
        return;
    const stepAutoReply = yield (0, ShowStepAutoReplyMessageService_1.default)(0, 0, 0, true, instance.tenantId);
    if (!stepAutoReply)
        return;
    const contato = yield Contact_1.default.findByPk(instance.contactId);
    const { celularTeste } = stepAutoReply.autoReply;
    const celularContato = contato === null || contato === void 0 ? void 0 : contato.number;
    if ((celularTeste && (celularContato === null || celularContato === void 0 ? void 0 : celularContato.indexOf(celularTeste.substr(1))) === -1) ||
        !celularContato) {
        if (instance.channel !== "telegram") {
            return;
        }
    }
    yield instance.update({
        autoReplyId: stepAutoReply.autoReply.id,
        stepAutoReplyId: stepAutoReply.id
    });
    yield (0, CreateLogTicketService_1.default)({
        ticketId: instance.id,
        type: "chatBot"
    });
});
exports.default = AutoReplyWelcome;
//# sourceMappingURL=CheckChatBotWelcome.js.map