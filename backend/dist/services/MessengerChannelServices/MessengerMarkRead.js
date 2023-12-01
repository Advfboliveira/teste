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
const sequelize_1 = require("sequelize");
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const MessengerMarkRead = (messageObj, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield Message_1.default.findAll({
        where: {
            tenantId,
            createdAt: {
                [sequelize_1.Op.lte]: new Date(messageObj.read.watermark)
            },
            fromMe: true,
            ack: {
                [sequelize_1.Op.in]: [1, 2]
            }
        },
        include: [
            {
                model: Ticket_1.default,
                where: { tenantId },
                include: [
                    {
                        model: Contact_1.default,
                        where: {
                            tenantId,
                            messengerId: messageObj.sender.id
                        }
                    }
                ]
            }
        ]
    });
    yield Promise.all(messages.map((message) => __awaiter(void 0, void 0, void 0, function* () {
        yield message.update({ ack: 3 });
        (0, socketEmit_1.default)({
            tenantId,
            type: "chat:ack",
            payload: Object.assign(Object.assign({}, message.dataValues), { mediaUrl: message.mediaUrl, id: message.id, timestamp: message.timestamp, messageId: message.messageId, status: "sended", ack: 3 })
        });
    })));
});
exports.default = MessengerMarkRead;
//# sourceMappingURL=MessengerMarkRead.js.map