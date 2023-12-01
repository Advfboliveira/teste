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
const UpdateTicketService_1 = __importDefault(require("../services/TicketServices/UpdateTicketService"));
const UpdateDeletedUserOpenTicketsStatus = (tickets, tenantId, userIdRequest) => __awaiter(void 0, void 0, void 0, function* () {
    tickets.forEach((t) => __awaiter(void 0, void 0, void 0, function* () {
        const ticketId = t.id.toString();
        yield (0, UpdateTicketService_1.default)({
            ticketData: { status: "pending", tenantId },
            ticketId,
            userIdRequest
        });
        // const io = getIO();
        // if (ticket.status !== oldStatus) {
        //   io.to(`${tenantId}-${oldStatus}`).emit(`${tenantId}-ticket`, {
        //     action: "delete",
        //     ticketId: ticket.id
        //   });
        // }
        // io.to(`${tenantId}-${ticket.status}`)
        //   .to(`${tenantId}-${ticketId}`)
        //   .emit(`${tenantId}-ticket`, {
        //     action: "updateStatus",
        //     ticket
        //   });
    }));
});
exports.default = UpdateDeletedUserOpenTicketsStatus;
//# sourceMappingURL=UpdateDeletedUserOpenTicketsStatus.js.map