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
exports.getIO = exports.initIO = void 0;
const socket_io_1 = require("socket.io");
const socket_io_redis_1 = __importDefault(require("socket.io-redis"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const decodeTokenSocket_1 = __importDefault(require("./decodeTokenSocket"));
const logger_1 = require("../utils/logger");
const User_1 = __importDefault(require("../models/User"));
const Chat_1 = __importDefault(require("./socketChat/Chat"));
let io;
const initIO = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*"
        },
        pingTimeout: 180000,
        pingInterval: 60000
    });
    const connRedis = {
        host: process.env.IO_REDIS_SERVER,
        port: Number(process.env.IO_REDIS_PORT),
        username: process.env.IO_REDIS_USERNAME,
        password: process.env.IO_REDIS_PASSWORD
    };
    // apresentando problema na assinatura
    const redis = socket_io_redis_1.default;
    io.adapter(redis(connRedis));
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const token = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
            const verify = (0, decodeTokenSocket_1.default)(token);
            if (verify.isValid) {
                const auth = (_c = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _c === void 0 ? void 0 : _c.auth;
                socket.handshake.auth = Object.assign(Object.assign(Object.assign({}, auth), verify.data), { id: String(verify.data.id), tenantId: String(verify.data.tenantId) });
                const user = yield User_1.default.findByPk(verify.data.id, {
                    attributes: [
                        "id",
                        "tenantId",
                        "name",
                        "email",
                        "profile",
                        "status",
                        "lastLogin",
                        "lastOnline"
                    ]
                });
                socket.handshake.auth.user = user;
                next();
            }
            next(new Error("authentication error"));
        }
        catch (error) {
            logger_1.logger.warn(`tokenInvalid: ${socket}`);
            socket.emit(`tokenInvalid:${socket.id}`);
            next(new Error("authentication error"));
        }
    }));
    io.on("connection", socket => {
        const { tenantId } = socket.handshake.auth;
        if (tenantId) {
            logger_1.logger.info({
                message: "Client connected in tenant",
                data: socket.handshake.auth
            });
            // create room to tenant
            socket.join(tenantId.toString());
            socket.on(`${tenantId}:joinChatBox`, ticketId => {
                logger_1.logger.info(`Client joined a ticket channel ${tenantId}:${ticketId}`);
                socket.join(`${tenantId}:${ticketId}`);
            });
            socket.on(`${tenantId}:joinNotification`, () => {
                logger_1.logger.info(`A client joined notification channel ${tenantId}:notification`);
                socket.join(`${tenantId}:notification`);
            });
            socket.on(`${tenantId}:joinTickets`, status => {
                logger_1.logger.info(`A client joined to ${tenantId}:${status} tickets channel.`);
                socket.join(`${tenantId}:${status}`);
            });
            Chat_1.default.register(socket);
        }
        socket.on("disconnect", (reason) => {
            logger_1.logger.info({
                message: `SOCKET Client disconnected , ${tenantId}, ${reason}`
            });
        });
    });
    return io;
};
exports.initIO = initIO;
const getIO = () => {
    if (!io) {
        throw new AppError_1.default("Socket IO not initialized");
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map