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
exports.getMessengerBot = exports.initMessengerBot = void 0;
/* eslint-disable eqeqeq */
const messaging_api_messenger_1 = require("messaging-api-messenger");
const process_1 = __importDefault(require("process"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const logger_1 = require("../utils/logger");
const sessionsMessenger = [];
const initMessengerBot = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const io = getIO();
        const accessToken = connection.tokenAPI;
        const appId = process_1.default.env.FACEBOOK_APP_ID;
        // const appSecret = "3266b8c98ac59f3e957a5efeaaa13500";
        // const password = "";
        if (!accessToken) {
            throw new Error("Not token configured");
        }
        // if (connection && connection.session) {
        //   sessionCfg = JSON.parse(connection.session);
        // }
        const messengerClient = new messaging_api_messenger_1.MessengerClient({
            accessToken,
            appId
            // appSecret
            // version: '6.0',
        });
        messengerClient.id = connection.id;
        const sessionIndex = sessionsMessenger.findIndex(s => s.id === connection.id);
        if (sessionIndex === -1) {
            messengerClient.id = connection.id;
            sessionsMessenger.push(messengerClient);
        }
        else {
            messengerClient.id = connection.id;
            sessionsMessenger[sessionIndex] = messengerClient;
        }
        return messengerClient;
    }
    catch (err) {
        logger_1.logger.error(`initMessengerBot error | Error: ${err}`);
        throw new AppError_1.default(`${err}`, 404);
        // 'Error: Protocol error (Runtime.callFunctionOn): Session closed.'
    }
});
exports.initMessengerBot = initMessengerBot;
const getMessengerBot = (channelId) => {
    // logger.info(`channelId: ${ channelId } | checkState: ${ checkState }`);
    const sessionIndex = sessionsMessenger.findIndex(s => s.id == channelId);
    return sessionsMessenger[sessionIndex];
};
exports.getMessengerBot = getMessengerBot;
//# sourceMappingURL=messengerBot.js.map