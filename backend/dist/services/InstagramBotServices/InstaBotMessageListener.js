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
exports.InstaBotMessageListener = void 0;
const handleRealtimeReceive_1 = __importDefault(require("./handleRealtimeReceive"));
const InstaBotMessageListener = (instaBot) => {
    instaBot.realtime.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // não processar as mudanças de status
        if (ctx.message.op === "replace" && ctx.message_type === 1)
            return;
        // evitar envio duplicato não processar os envios feito pelo sistema
        if (((_a = instaBot === null || instaBot === void 0 ? void 0 : instaBot.accountLogin) === null || _a === void 0 ? void 0 : _a.pk) === ctx.message.user_id)
            return;
        // op = replace,
        // message_type = 1
        // HandleMessage(messages, instaBot);
        (0, handleRealtimeReceive_1.default)(ctx, instaBot);
    }));
    instaBot.realtime.on("direct", ev => {
        console.log("direct ev", ev);
    });
    instaBot.realtime.on("realtimeSub", ev => {
        console.log("realtimeSub ev", ev);
    });
    instaBot.realtime.on("iris", ev => {
        console.log("iris ev", ev);
    });
    instaBot.realtime.on("error", console.error);
    instaBot.realtime.on("close", () => console.error("RealtimeClient closed"));
    instaBot.fbns.on("push", (data) => {
        // this.handleFbnsReceive(data)
        console.log("handleFbnsReceive", data);
    });
    // tbot.launch();
};
exports.InstaBotMessageListener = InstaBotMessageListener;
//# sourceMappingURL=InstaBotMessageListener.js.map