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
const database_1 = __importDefault(require("../../database"));
const query = `
  select dt_ref, to_char(dt_ref, 'DD/MM/YYYY') dt_referencia , label, qtd, ROUND(100.0*(qtd/sum(qtd) over ()), 2) pertentual  from (
  select
  date_trunc('day', t."createdAt") dt_ref,
  --to_char(date_trunc('day', t."createdAt"), 'DD/MM/YYYY') ,
  t.channel as label,
  count(1) as qtd
  from "Tickets" t
  INNER JOIN "LogTickets" lt ON lt."ticketId" = t."id"
  where t."tenantId" = :tenantId  AND lt."userId" = :userId
  and (lt."type" LIKE 'open' OR lt."type" LIKE 'receivedTransfer')
  and date_trunc('day', t."createdAt") between :startDate and :endDate
  group by date_trunc('day', t."createdAt"), t.channel
  ) a
  order by 1
`;
const queryAdmin = `
  select dt_ref, to_char(dt_ref, 'DD/MM/YYYY') dt_referencia , label, qtd, ROUND(100.0*(qtd/sum(qtd) over ()), 2) pertentual  from (
  select
  date_trunc('day', t."createdAt") dt_ref,
  --to_char(date_trunc('day', t."createdAt"), 'DD/MM/YYYY') ,
  t.channel as label,
  count(1) as qtd
  from "Tickets" t
  INNER JOIN "LogTickets" lt ON lt."ticketId" = t."id"
  where t."tenantId" = :tenantId
  and (lt."type" LIKE 'open' OR lt."type" LIKE 'receivedTransfer')
  and date_trunc('day', t."createdAt") between :startDate and :endDate
  group by date_trunc('day', t."createdAt"), t.channel
  ) a
  order by 1
`;
const DashTicketsEvolutionChannels = ({ startDate, endDate, tenantId, userId, userProfile }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield database_1.default.query(userProfile == "admin" ? queryAdmin : query, {
        replacements: {
            tenantId,
            startDate,
            endDate,
            userId
        },
        type: sequelize_1.QueryTypes.SELECT
        // logging: console.log
    });
    return data;
});
exports.default = DashTicketsEvolutionChannels;
//# sourceMappingURL=DashTicketsEvolutionChannels.js.map