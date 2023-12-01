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
const jsonwebtoken_1 = require("jsonwebtoken");
const rabbitmq_server_1 = __importDefault(require("../../libs/rabbitmq-server"));
const auth_1 = __importDefault(require("../../config/auth"));
const MessengerHandleMessage_1 = __importDefault(require("./MessengerHandleMessage"));
const MessengerConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    const rabbit = new rabbitmq_server_1.default(process.env.AMQP_URL || "");
    yield rabbit.start();
    rabbit.consume("messenger", message => {
        const content = JSON.parse(message.content.toString());
        const decode = (0, jsonwebtoken_1.verify)(content.token, auth_1.default.secret);
        if (!decode)
            return;
        (0, MessengerHandleMessage_1.default)(content.messages);
    });
});
exports.default = MessengerConsumer;
//# sourceMappingURL=MessengerConsumer.js.map