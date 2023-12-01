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
// import { subHours } from "date-fns";
const sequelize_1 = require("sequelize");
const Contact_1 = __importDefault(require("../../models/Contact"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const User_1 = __importDefault(require("../../models/User"));
const ShowTicketService_1 = __importDefault(require("./ShowTicketService"));
const CampaignContacts_1 = __importDefault(require("../../models/CampaignContacts"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
// import CheckChatBotWelcome from "../../helpers/CheckChatBotWelcome";
const CheckChatBotFlowWelcome_1 = __importDefault(require("../../helpers/CheckChatBotFlowWelcome"));
const CreateLogTicketService_1 = __importDefault(require("./CreateLogTicketService"));
const Message_1 = __importDefault(require("../../models/Message"));
const FindOrCreateTicketService = ({ contact, whatsappId, unreadMessages, tenantId, groupContact, msg, isSync, channel }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // se for uma mensagem de campanha, não abrir tícket
    if (msg && msg.fromMe) {
        const msgCampaign = yield CampaignContacts_1.default.findOne({
            where: {
                contactId: contact.id,
                messageId: ((_a = msg.id) === null || _a === void 0 ? void 0 : _a.id) || msg.message_id || msg.item_id
            }
        });
        if (msgCampaign === null || msgCampaign === void 0 ? void 0 : msgCampaign.id) {
            return { isCampaignMessage: true };
        }
    }
    if (msg && msg.fromMe) {
        const farewellMessage = yield Message_1.default.findOne({
            where: { messageId: ((_b = msg.id) === null || _b === void 0 ? void 0 : _b.id) || msg.message_id || msg.item_id },
            include: ["ticket"]
        });
        if (((_c = farewellMessage === null || farewellMessage === void 0 ? void 0 : farewellMessage.ticket) === null || _c === void 0 ? void 0 : _c.status) === "closed" &&
            (farewellMessage === null || farewellMessage === void 0 ? void 0 : farewellMessage.ticket.lastMessage) === msg.body) {
            const ticket = farewellMessage.ticket;
            ticket.isFarewellMessage = true;
            return ticket;
        }
    }
    let ticket = yield Ticket_1.default.findOne({
        where: {
            status: {
                [sequelize_1.Op.or]: ["open", "pending"]
            },
            tenantId,
            whatsappId,
            contactId: groupContact ? groupContact.id : contact.id
        },
        include: [
            {
                model: Contact_1.default,
                as: "contact",
                include: [
                    "extraInfo",
                    "tags",
                    {
                        association: "wallets",
                        attributes: ["id", "name"]
                    }
                ]
            },
            {
                model: User_1.default,
                as: "user",
                attributes: ["id", "name"]
            },
            {
                association: "whatsapp",
                attributes: ["id", "name"]
            }
        ]
    });
    if (ticket) {
        unreadMessages =
            ["telegram", "waba", "instagram", "messenger"].includes(channel) &&
                unreadMessages > 0
                ? (unreadMessages += ticket.unreadMessages)
                : unreadMessages;
        yield ticket.update({ unreadMessages });
        (0, socketEmit_1.default)({
            tenantId,
            type: "ticket:update",
            payload: ticket
        });
        return ticket;
    }
    if (groupContact) {
        ticket = yield Ticket_1.default.findOne({
            where: {
                contactId: groupContact.id,
                tenantId,
                whatsappId
            },
            order: [["updatedAt", "DESC"]],
            include: [
                {
                    model: Contact_1.default,
                    as: "contact",
                    include: [
                        "extraInfo",
                        "tags",
                        {
                            association: "wallets",
                            attributes: ["id", "name"]
                        }
                    ]
                },
                {
                    model: User_1.default,
                    as: "user",
                    attributes: ["id", "name"]
                },
                {
                    association: "whatsapp",
                    attributes: ["id", "name"]
                }
            ]
        });
        if (ticket) {
            yield ticket.update({
                status: "pending",
                userId: null,
                unreadMessages
            });
            (0, socketEmit_1.default)({
                tenantId,
                type: "ticket:update",
                payload: ticket
            });
            return ticket;
        }
    }
    else {
        ticket = yield Ticket_1.default.findOne({
            where: {
                // updatedAt: {
                //   [Op.between]: [+subHours(new Date(), 24), +new Date()]
                // },
                status: {
                    [sequelize_1.Op.in]: ["open", "pending"]
                },
                tenantId,
                whatsappId,
                contactId: contact.id
            },
            order: [["updatedAt", "DESC"]],
            include: [
                {
                    model: Contact_1.default,
                    as: "contact",
                    include: [
                        "extraInfo",
                        "tags",
                        {
                            association: "wallets",
                            attributes: ["id", "name"]
                        }
                    ]
                },
                {
                    model: User_1.default,
                    as: "user",
                    attributes: ["id", "name"]
                },
                {
                    association: "whatsapp",
                    attributes: ["id", "name"]
                }
            ]
        });
        if (ticket) {
            yield ticket.update({
                status: "pending",
                userId: null,
                unreadMessages
            });
            (0, socketEmit_1.default)({
                tenantId,
                type: "ticket:update",
                payload: ticket
            });
            return ticket;
        }
    }
    const ticketCreated = yield Ticket_1.default.create({
        contactId: groupContact ? groupContact.id : contact.id,
        status: "pending",
        isGroup: !!groupContact,
        unreadMessages,
        whatsappId,
        tenantId,
        channel
    });
    yield (0, CreateLogTicketService_1.default)({
        ticketId: ticketCreated.id,
        type: "create"
    });
    if ((msg && !msg.fromMe) || isSync) {
        yield (0, CheckChatBotFlowWelcome_1.default)(ticketCreated);
    }
    ticket = yield (0, ShowTicketService_1.default)({ id: ticketCreated.id, tenantId });
    ticket.setDataValue("isCreated", true);
    (0, socketEmit_1.default)({
        tenantId,
        type: "ticket:update",
        payload: ticket
    });
    return ticket;
});
exports.default = FindOrCreateTicketService;
//# sourceMappingURL=FindOrCreateTicketService.js.map