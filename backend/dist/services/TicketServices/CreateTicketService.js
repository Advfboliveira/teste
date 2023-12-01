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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CheckContactOpenTickets_1 = __importDefault(require("../../helpers/CheckContactOpenTickets"));
const GetDefaultWhatsApp_1 = __importDefault(require("../../helpers/GetDefaultWhatsApp"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const ShowContactService_1 = __importDefault(require("../ContactServices/ShowContactService"));
const CreateLogTicketService_1 = __importDefault(require("./CreateLogTicketService"));
const ShowTicketService_1 = __importDefault(require("./ShowTicketService"));
const CreateTicketService = ({ contactId, status, userId, tenantId, channel, channelId = undefined }) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultWhatsapp = yield (0, GetDefaultWhatsApp_1.default)(tenantId, channelId);
    if (!channel || !["instagram", "telegram", "whatsapp"].includes(channel)) {
        throw new AppError_1.default("ERR_CREATING_TICKET");
    }
    yield (0, CheckContactOpenTickets_1.default)(contactId);
    const { isGroup } = yield (0, ShowContactService_1.default)({ id: contactId, tenantId });
    const { id } = yield defaultWhatsapp.$create("ticket", {
        contactId,
        status,
        isGroup,
        userId,
        isActiveDemand: true,
        channel,
        tenantId
    });
    const ticket = yield (0, ShowTicketService_1.default)({ id, tenantId });
    if (!ticket) {
        throw new AppError_1.default("ERR_CREATING_TICKET");
    }
    yield (0, CreateLogTicketService_1.default)({
        userId,
        ticketId: ticket.id,
        type: "create"
    });
    (0, socketEmit_1.default)({
        tenantId,
        type: "ticket:update",
        payload: ticket
    });
    return ticket;
});
exports.default = CreateTicketService;
//# sourceMappingURL=CreateTicketService.js.map