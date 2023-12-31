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
const Contact_1 = __importDefault(require("../../models/Contact"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const DeleteContactService = ({ id, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield Contact_1.default.findOne({
        where: { id, tenantId }
    });
    if (!contact) {
        throw new AppError_1.default("ERR_NO_CONTACT_FOUND", 404);
    }
    const tickets = yield Ticket_1.default.count({
        where: { contactId: id }
    });
    if (tickets) {
        throw new AppError_1.default("ERR_CONTACT_TICKETS_REGISTERED", 404);
    }
    yield contact.destroy();
    (0, socketEmit_1.default)({
        tenantId,
        type: "contact:delete",
        payload: contact
    });
});
exports.default = DeleteContactService;
//# sourceMappingURL=DeleteContactService.js.map