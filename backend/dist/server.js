"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_graceful_shutdown_1 = __importDefault(require("http-graceful-shutdown"));
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./libs/socket");
const StartAllWhatsAppsSessions_1 = require("./services/WbotServices/StartAllWhatsAppsSessions");
const logger_1 = require("./utils/logger");
const PORTA = process.env.PORT || "3000";
const server = app_1.default.listen(PORTA, () => {
    logger_1.logger.info(`Server started on port: ${PORTA}`);
});
(0, socket_1.initIO)(server);
(0, StartAllWhatsAppsSessions_1.StartAllWhatsAppsSessions)();
(0, http_graceful_shutdown_1.default)(server);
//# sourceMappingURL=server.js.map