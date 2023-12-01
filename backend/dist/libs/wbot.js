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
exports.getWbot = exports.initWbot = exports.removeWbot = exports.apagarPastaSessao = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const socket_1 = require("./socket");
const logger_1 = require("../utils/logger");
const SyncUnreadMessagesWbot_1 = __importDefault(require("../services/WbotServices/SyncUnreadMessagesWbot"));
const Queue_1 = __importDefault(require("./Queue"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const sessions = [];
const checking = {};
const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-gpu",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain"
];
const apagarPastaSessao = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pathRoot = path_1.default.resolve(__dirname, "..", "..", ".wwebjs_auth");
    const pathSession = `${pathRoot}/session-wbot-${id}`;
    try {
        yield (0, promises_1.rm)(pathSession, { recursive: true, force: true });
    }
    catch (error) {
        logger_1.logger.info(`apagarPastaSessao:: ${pathSession}`);
        logger_1.logger.error(error);
    }
});
exports.apagarPastaSessao = apagarPastaSessao;
const removeWbot = (whatsappId) => {
    try {
        const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
        if (sessionIndex !== -1) {
            sessions[sessionIndex].destroy();
            sessions.splice(sessionIndex, 1);
        }
    }
    catch (err) {
        logger_1.logger.error(`removeWbot | Error: ${err}`);
    }
};
exports.removeWbot = removeWbot;
const checkMessages = (wbot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isConnectStatus = wbot && (yield wbot.getState()) === "CONNECTED"; // getValue(`wbotStatus-${tenantId}`);
        logger_1.logger.info("wbot:checkMessages:status", wbot.id, tenantId, isConnectStatus);
        if (isConnectStatus) {
            logger_1.logger.info("wbot:connected:checkMessages", wbot, tenantId);
            Queue_1.default.add("SendMessages", { sessionId: wbot.id, tenantId });
        }
    }
    catch (error) {
        const strError = String(error);
        // se a sessão tiver sido fechada, limpar a checagem de mensagens e bot
        if (strError.indexOf("Session closed.") !== -1) {
            logger_1.logger.error(`BOT Whatsapp desconectado. Tenant: ${tenantId}:: BOT ID: ${wbot.id}`);
            clearInterval(wbot.checkMessages);
            (0, exports.removeWbot)(wbot.id);
            return;
        }
        logger_1.logger.error(`ERROR: checkMessages Tenant: ${tenantId}::`, error);
    }
});
const initWbot = (whatsapp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const io = (0, socket_1.getIO)();
            const sessionName = whatsapp.name;
            const { tenantId } = whatsapp;
            let sessionCfg;
            if (whatsapp === null || whatsapp === void 0 ? void 0 : whatsapp.session) {
                sessionCfg = JSON.parse(whatsapp.session);
            }
            const wbot = new whatsapp_web_js_1.Client({
                authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: `wbot-${whatsapp.id}` }),
                puppeteer: {
                    // headless: false,
                    executablePath: process.env.CHROME_BIN || undefined,
                    args: [`--user-agent=${whatsapp_web_js_1.DefaultOptions.userAgent}`, ...minimal_args]
                }
            });
            wbot.id = whatsapp.id;
            wbot.initialize();
            wbot.on("qr", (qr) => __awaiter(void 0, void 0, void 0, function* () {
                if (whatsapp.status === "CONNECTED")
                    return;
                logger_1.logger.info(`Session QR CODE: ${sessionName}-ID: ${whatsapp.id}-${whatsapp.status}`);
                yield whatsapp.update({ qrcode: qr, status: "qrcode", retries: 0 });
                const sessionIndex = sessions.findIndex(s => s.id === whatsapp.id);
                if (sessionIndex === -1) {
                    wbot.id = whatsapp.id;
                    sessions.push(wbot);
                }
                io.emit(`${tenantId}:whatsappSession`, {
                    action: "update",
                    session: whatsapp
                });
            }));
            wbot.on("authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
                logger_1.logger.info(`Session: ${sessionName} AUTHENTICATED`);
            }));
            wbot.on("auth_failure", (msg) => __awaiter(void 0, void 0, void 0, function* () {
                logger_1.logger.error(`Session: ${sessionName}-AUTHENTICATION FAILURE :: ${msg}`);
                if (whatsapp.retries > 1) {
                    yield whatsapp.update({
                        retries: 0,
                        session: ""
                    });
                }
                const retry = whatsapp.retries;
                yield whatsapp.update({
                    status: "DISCONNECTED",
                    retries: retry + 1
                });
                io.emit(`${tenantId}:whatsappSession`, {
                    action: "update",
                    session: whatsapp
                });
                reject(new Error("Error starting whatsapp session."));
            }));
            wbot.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                logger_1.logger.info(`Session: ${sessionName}-READY`);
                const info = wbot === null || wbot === void 0 ? void 0 : wbot.info;
                yield whatsapp.update({
                    status: "CONNECTED",
                    qrcode: "",
                    retries: 0,
                    number: (_b = (_a = wbot === null || wbot === void 0 ? void 0 : wbot.info) === null || _a === void 0 ? void 0 : _a.wid) === null || _b === void 0 ? void 0 : _b.user,
                    phone: (info === null || info === void 0 ? void 0 : info.phone) || {}
                });
                io.emit(`${tenantId}:whatsappSession`, {
                    action: "update",
                    session: whatsapp
                });
                io.emit(`${tenantId}:whatsappSession`, {
                    action: "readySession",
                    session: whatsapp
                });
                const sessionIndex = sessions.findIndex(s => s.id === whatsapp.id);
                if (sessionIndex === -1) {
                    wbot.id = whatsapp.id;
                    sessions.push(wbot);
                }
                wbot.sendPresenceAvailable();
                (0, SyncUnreadMessagesWbot_1.default)(wbot, tenantId);
                resolve(wbot);
            }));
            wbot.checkMessages = setInterval(checkMessages, +(process.env.CHECK_INTERVAL || 5000), wbot, tenantId);
            // WhatsappConsumer(tenantId);
        }
        catch (err) {
            logger_1.logger.error(`initWbot error | Error: ${err}`);
        }
    });
});
exports.initWbot = initWbot;
const getWbot = (whatsappId) => {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex === -1) {
        throw new AppError_1.default("ERR_WAPP_NOT_INITIALIZED");
    }
    return sessions[sessionIndex];
};
exports.getWbot = getWbot;
//# sourceMappingURL=wbot.js.map