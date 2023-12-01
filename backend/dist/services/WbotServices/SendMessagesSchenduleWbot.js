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
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const sequelize_1 = require("sequelize");
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const logger_1 = require("../../utils/logger");
const Contact_1 = __importDefault(require("../../models/Contact"));
// import SetTicketMessagesAsRead from "../../helpers/SetTicketMessagesAsRead";
const SendMessagesSchenduleWbot = () => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        fromMe: true,
        messageId: { [sequelize_1.Op.is]: null },
        status: "pending",
        scheduleDate: {
            [sequelize_1.Op.lte]: new Date()
        }
    };
    const messages = yield Message_1.default.findAll({
        where,
        include: [
            {
                model: Contact_1.default,
                as: "contact",
                where: {
                    number: {
                        [sequelize_1.Op.notIn]: ["", "null"]
                    }
                }
            },
            {
                model: Ticket_1.default,
                as: "ticket",
                where: {
                    channel: "whatsapp"
                },
                include: ["contact"]
            },
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ],
        order: [["createdAt", "ASC"]]
    });
    for (const message of messages) {
        logger_1.logger.info(`Message Schendule Queue: ${message.id} | Tenant: ${message.tenantId} `);
        global.rabbitWhatsapp.publishInQueue(`whatsapp::${message.tenantId}`, JSON.stringify(Object.assign(Object.assign({}, message.toJSON()), { contact: message.ticket.contact.toJSON() })));
        message.update({ status: "queue" });
    }
});
exports.default = SendMessagesSchenduleWbot;
//# sourceMappingURL=SendMessagesSchenduleWbot.js.map