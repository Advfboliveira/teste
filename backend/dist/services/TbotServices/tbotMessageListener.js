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
exports.tbotMessageListener = void 0;
const HandleMessageTelegram_1 = __importDefault(require("./HandleMessageTelegram"));
const tbotMessageListener = (tbot) => {
    tbot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        (0, HandleMessageTelegram_1.default)(ctx, tbot);
    }));
    tbot.on("edited_message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        (0, HandleMessageTelegram_1.default)(ctx, tbot);
        // HandleMessageTelegram(ctx, tbot);
    }));
    // tbot.launch();
};
exports.tbotMessageListener = tbotMessageListener;
//# sourceMappingURL=tbotMessageListener.js.map