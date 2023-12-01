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
exports.HandleMessage = exports.wbotMessageListener = void 0;
const HandleMessage_1 = __importDefault(require("./helpers/HandleMessage"));
exports.HandleMessage = HandleMessage_1.default;
const HandleMsgAck_1 = __importDefault(require("./helpers/HandleMsgAck"));
const wbotMessageListener = (wbot) => {
    // const queue = `whatsapp::${wbot.id}`;
    wbot.on("message_create", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        // desconsiderar atualização de status
        if (msg.isStatus) {
            return;
        }
        (0, HandleMessage_1.default)(msg, wbot);
    }));
    wbot.on("media_uploaded", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        (0, HandleMessage_1.default)(msg, wbot);
    }));
    wbot.on("message_ack", (msg, ack) => __awaiter(void 0, void 0, void 0, function* () {
        (0, HandleMsgAck_1.default)(msg, ack);
    }));
};
exports.wbotMessageListener = wbotMessageListener;
//# sourceMappingURL=wbotMessageListener.js.map