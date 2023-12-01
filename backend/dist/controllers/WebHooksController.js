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
exports.ReceivedRequestMessenger = exports.CheckServiceMessenger = exports.ReceivedRequest360 = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const ReceivedRequest360 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            token: req.params.token,
            messages: req.body
        };
        yield req.app.rabbit.publishInQueue("waba360", JSON.stringify(message));
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    // Queue.add("SendMessageAPI", newMessage);
    return res.status(200).json({ message: "Message add queue" });
});
exports.ReceivedRequest360 = ReceivedRequest360;
const CheckServiceMessenger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challenge = req.query["hub.challenge"];
    console.log("WEBHOOK_VERIFIED");
    return res.status(200).send(challenge);
});
exports.CheckServiceMessenger = CheckServiceMessenger;
const ReceivedRequestMessenger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            token: req.params.token,
            messages: req.body
        };
        yield req.app.rabbit.publishInQueue("messenger", JSON.stringify(message));
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    // Queue.add("SendMessageAPI", newMessage);
    return res.status(200).json({ message: "Message add queue" });
});
exports.ReceivedRequestMessenger = ReceivedRequestMessenger;
//# sourceMappingURL=WebHooksController.js.map