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
/* eslint-disable eqeqeq */
const sequelize_1 = require("sequelize");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const FindUpdateTicketsInactiveChatBot = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = `
    select
    t.id,
    --t."contactId",
    --t."lastInteractionBot",
    --t.status,
    --config->'configurations',
    --concat(config->'configurations'->'notResponseMessage'->'time', ' MINUTES')::interval as time_action,
    config->'configurations'->'notResponseMessage'->'type' as type_action,
    config->'configurations'->'notResponseMessage'->'destiny' as destiny
    from "Tickets" t
    inner join "ChatFlow" cf on t."tenantId" = cf."tenantId" and cf.id = t."chatFlowId"
    inner join "Settings" s on s."tenantId" = cf."tenantId" and s."key" = 'botTicketActive'
    cross join lateral json_array_elements(cf.flow->'nodeList') as config
    where t."chatFlowId"::text = s.value
    and t.status = 'pending'
    and config->>'type' = 'configurations'
    and t."lastInteractionBot" < CURRENT_TIMESTAMP - concat(config->'configurations'->'notResponseMessage'->'time', ' MINUTES')::interval
    and (t."queueId" is null and t."userId" is null)
  `;
    const tickets = yield ((_a = Ticket_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(query, {
        type: sequelize_1.QueryTypes.SELECT
    }));
    Promise.all(tickets.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        // se não houve destino, retornar
        if (!item.destiny)
            return;
        const ticket = yield Ticket_1.default.findByPk(item.id);
        if (ticket) {
            const values = {
                chatFlowId: null,
                stepChatFlow: null,
                botRetries: 0,
                lastInteractionBot: new Date()
            };
            // instance.type_action: 1 = fila | 2 = usuario
            if (item.type_action == 1) {
                values.queueId = item.destiny;
            }
            if (item.type_action == 2) {
                values.userId = item.destiny;
            }
            yield ticket.update(values);
            (0, socketEmit_1.default)({
                tenantId: ticket.tenantId,
                type: "ticket:update",
                payload: ticket
            });
        }
    })));
});
exports.default = FindUpdateTicketsInactiveChatBot;
//# sourceMappingURL=FindUpdateTicketsInactiveChatBot.js.map