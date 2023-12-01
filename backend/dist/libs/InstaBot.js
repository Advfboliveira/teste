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
exports.removeInstaBot = exports.getInstaBot = exports.initInstaBot = void 0;
/* eslint-disable camelcase */
const instagram_private_api_1 = require("instagram-private-api");
const instagram_mqtt_1 = require("instagram_mqtt");
const AppError_1 = __importDefault(require("../errors/AppError"));
// import { getIO } from "./socket";
const logger_1 = require("../utils/logger");
const sessions = [];
const initInstaBot = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const io = getIO();
        let sessionCfg;
        let loggedUser;
        // const { tenantId } = connection;
        const username = `@${connection.instagramUser}`;
        const password = connection.instagramKey;
        // const password = "";
        if (!username || !password) {
            throw new Error("Not credentials");
        }
        if (connection && connection.session) {
            sessionCfg = JSON.parse(connection.session);
        }
        // se não funcionar, necessário adequar o "as"
        const ig = (0, instagram_mqtt_1.withFbnsAndRealtime)(new instagram_private_api_1.IgApiClient());
        ig.id = connection.id;
        ig.state.generateDevice(username);
        if (connection.session) {
            const { accountLogin } = ig;
            yield ig.importState(JSON.parse(connection.session));
            ig.accountLogin = accountLogin;
        }
        else {
            // await ig.simulate.preLoginFlow();
            loggedUser = yield ig.account.login(username, password);
            ig.accountLogin = loggedUser;
            process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
                yield ig.simulate.postLoginFlow();
            }));
            sessionCfg = yield ig.exportState();
            yield connection.update({
                session: sessionCfg
            });
        }
        yield ig.realtime.connect({
            irisData: yield ig.feed.directInbox().request()
        });
        // PartialObserver<FbnsNotificationUnknown>
        // ig.fbns.push$.subscribe((data: any) => {
        yield ig.fbns.connect({
            autoReconnect: true
        });
        const sessionIndex = sessions.findIndex(s => s.id === connection.id);
        if (sessionIndex === -1) {
            ig.id = connection.id;
            if (!ig.accountLogin) {
                ig.accountLogin = yield ig.account.currentUser();
            }
            sessions.push(ig);
        }
        else {
            ig.id = connection.id;
            if (!ig.accountLogin) {
                ig.accountLogin = yield ig.account.currentUser();
            }
            sessions[sessionIndex] = ig;
        }
        return ig;
    }
    catch (err) {
        logger_1.logger.error(`initWbot error | Error: ${err}`);
        throw new AppError_1.default(`${err}`, 404);
        // 'Error: Protocol error (Runtime.callFunctionOn): Session closed.'
    }
});
exports.initInstaBot = initInstaBot;
const getInstaBot = (channelId) => {
    // logger.info(`channelId: ${ channelId } | checkState: ${ checkState }`);
    const sessionIndex = sessions.findIndex(s => s.id === channelId);
    return sessions[sessionIndex];
};
exports.getInstaBot = getInstaBot;
const removeInstaBot = (connection) => {
    try {
        const sessionIndex = sessions.findIndex(s => s.id === connection.id);
        if (sessionIndex !== -1) {
            sessions[sessionIndex].account.logout();
            sessions[sessionIndex].realtime.disconnect();
            sessions[sessionIndex].fbns.disconnect();
            sessions.splice(sessionIndex, 1);
        }
        connection.update({
            session: ""
        });
    }
    catch (err) {
        logger_1.logger.error(`removeWbot | Error: ${err}`);
    }
};
exports.removeInstaBot = removeInstaBot;
//# sourceMappingURL=InstaBot.js.map