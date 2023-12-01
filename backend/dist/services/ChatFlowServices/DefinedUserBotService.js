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
const User_1 = __importDefault(require("../../models/User"));
const CreateLogTicketService_1 = __importDefault(require("../TicketServices/CreateLogTicketService"));
const DefinedUserBotService = (ticket, queueId, tenantId, method = "R") => __awaiter(void 0, void 0, void 0, function* () {
    // method: R = Random | B = Balanced ;
    // R: pega usuario de forma randomica;
    // B: pega o usuario com menor número de atendimentos;
    var _a;
    if (method === "N")
        return;
    let query = `
    select u.id from "Users" u
    left join "UsersQueues" uq on (u.id = uq."userId")
    where u."isOnline" = true
    and u."profile" = 'user'
    and u."tenantId" = :tenantId
    and uq."queueId" = :queueId
    order by random() limit 1
  `;
    if (method === "B") {
        query = `
      select id from (
        select u.id, u."name", coalesce(count(t.id), 0) qtd_atendimentos  from "Users" u
        left join "UsersQueues" uq on (u.id = uq."userId")
        left join "Tickets" t on (t."userId" = u.id)
        where u."isOnline" = true
        and t.status not in ('closed', 'close')
        and u."profile" = 'user'
        and u."tenantId" = :tenantId
        and uq."queueId" = :queueId
        group by u.id, u."name"
        order by 3 limit 1
      ) a
    `;
    }
    const user = yield ((_a = User_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(query, {
        replacements: {
            tenantId,
            queueId
        },
        type: sequelize_1.QueryTypes.SELECT
    }));
    if (user.length) {
        const userId = user[0].id;
        yield ticket.update({
            userId
        });
        yield (0, CreateLogTicketService_1.default)({
            ticketId: ticket.id,
            type: "userDefine",
            userId
        });
    }
});
exports.default = DefinedUserBotService;
//# sourceMappingURL=DefinedUserBotService.js.map