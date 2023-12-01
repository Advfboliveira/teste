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
const isMessageExistsService = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const message = yield Message_1.default.findOne({
        where: { messageId: (_a = msg === null || msg === void 0 ? void 0 : msg.id) === null || _a === void 0 ? void 0 : _a.id }
    });
    if (!message) {
        console.log("Mensagem não existe", msg.id.id);
        return false;
    }
    console.log("Mensagem existente", msg.id.id);
    return true;
});
exports.default = isMessageExistsService;
//# sourceMappingURL=isMessageExistsService.js.map