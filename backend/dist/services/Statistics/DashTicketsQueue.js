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
  select label, qtd,  ROUND(100.0*(qtd/sum(qtd) over ()), 2) pertentual from (
  select
  coalesce(q.queue, 'Não informado') as label,
  count(1) as qtd
  from "Tickets" t
  left join "Queues" q on (t."queueId" = q.id)
  where t."tenantId" = :tenantId AND t."userId" = :userId
  and date_trunc('day', t."createdAt") between :startDate and :endDate
  group by t."queueId", q.queue
  ) a
  order by 2 Desc
`;
const queryAdmin = `
  select label, qtd,  ROUND(100.0*(qtd/sum(qtd) over ()), 2) pertentual from (
  select
  coalesce(q.queue, 'Não informado') as label,
  count(1) as qtd
  from "Tickets" t
  left join "Queues" q on (t."queueId" = q.id)
  where t."tenantId" = :tenantId
  and date_trunc('day', t."createdAt") between :startDate and :endDate
  group by t."queueId", q.queue
  ) a
  order by 2 Desc
`;
const DashTicketsQueue = ({ startDate, endDate, tenantId, userId, userProfile }) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = DashTicketsQueue;
//# sourceMappingURL=DashTicketsQueue.js.map