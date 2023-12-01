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
// import { Sequelize } from "sequelize-typescript";
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Message_1 = __importDefault(require("../../models/Message"));
const MessageOffLine_1 = __importDefault(require("../../models/MessageOffLine"));
const ShowTicketService_1 = __importDefault(require("../TicketServices/ShowTicketService"));
const ListMessagesService = ({ pageNumber = "1", ticketId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield (0, ShowTicketService_1.default)({ id: ticketId, tenantId });
    if (!ticket) {
        throw new AppError_1.default("ERR_NO_TICKET_FOUND", 404);
    }
    // await setMessagesAsRead(ticket);
    const limit = 30;
    const offset = limit * (+pageNumber - 1);
    const { count, rows: messages } = yield Message_1.default.findAndCountAll({
        where: { ticketId },
        limit,
        include: [
            "contact",
            {
                model: Message_1.default,
                as: "quotedMsg",
                include: ["contact"]
            }
        ],
        offset,
        // logging: console.log,
        order: [["createdAt", "DESC"]]
        // order: [
        //   Sequelize.literal(
        //     'coalesce(to_timestamp("Message"."timestamp") , "Message"."createdAt") desc'
        //   )
        // ]
    });
    let messagesOffLine = [];
    if (+pageNumber === 1) {
        const { rows } = yield MessageOffLine_1.default.findAndCountAll({
            where: { ticketId },
            include: [
                "contact",
                {
                    model: Message_1.default,
                    as: "quotedMsg",
                    include: ["contact"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });
        messagesOffLine = rows;
    }
    const hasMore = count > offset + messages.length;
    return {
        messages: messages.reverse(),
        messagesOffLine,
        ticket,
        count,
        hasMore
    };
});
exports.default = ListMessagesService;
//# sourceMappingURL=ListMessagesService.js.map