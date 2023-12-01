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
const Setting_1 = __importDefault(require("../models/Setting"));
const ChatFlow_1 = __importDefault(require("../models/ChatFlow"));
const CreateLogTicketService_1 = __importDefault(require("../services/TicketServices/CreateLogTicketService"));
const IsContactTest_1 = __importDefault(require("../services/ChatFlowServices/IsContactTest"));
const CheckChatBotFlowWelcome = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (instance.userId || instance.isGroup)
        return;
    const setting = yield Setting_1.default.findOne({
        where: {
            key: "botTicketActive",
            tenantId: instance.tenantId
        }
    });
    if (!setting || !setting.value)
        return;
    const chatFlow = yield ChatFlow_1.default.findOne({
        where: {
            id: +(setting === null || setting === void 0 ? void 0 : setting.value),
            tenantId: instance.tenantId
        }
    });
    if (!chatFlow)
        return;
    const contato = yield Contact_1.default.findByPk(instance.contactId);
    const { celularTeste } = chatFlow;
    const celularContato = contato === null || contato === void 0 ? void 0 : contato.number;
    if (yield (0, IsContactTest_1.default)(celularContato, celularTeste, instance.channel))
        return;
    const lineFlow = chatFlow.flow.lineList.find((line) => line.from === "start");
    yield instance.update({
        chatFlowId: chatFlow.id,
        stepChatFlow: lineFlow.to,
        lastInteractionBot: new Date()
    });
    yield (0, CreateLogTicketService_1.default)({
        ticketId: instance.id,
        type: "chatBot"
    });
});
exports.default = CheckChatBotFlowWelcome;
//# sourceMappingURL=CheckChatBotFlowWelcome.js.map