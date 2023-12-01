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
    select
    distinct(email),
    name,
    count(*) FILTER (where t.status = 'open') OVER (PARTITION by email ) as qtd_em_atendimento,
    count(*) FILTER (where t.status = 'pending') OVER (PARTITION by email) as qtd_pendentes,
    count(*) FILTER (where t.status = 'closed') OVER (PARTITION by email ) as qtd_resolvidos,
    count(*) OVER (PARTITION by email) as qtd_por_usuario,
    --ROUND(MIN(extract(epoch from AGE(to_timestamp(t."closedAt"/1000), t."createdAt")::interval)/60) OVER (PARTITION by email)::decimal, 0) menor_tma,
    --ROUND(MAX(extract(epoch from AGE(to_timestamp(t."closedAt"/1000), t."createdAt")::interval)/60) OVER (PARTITION by email)::decimal, 0) maior_tma,
    concat(coalesce(ROUND(AVG(extract(epoch from AGE(to_timestamp(t."closedAt"/1000), t."createdAt")::interval)/60) OVER (PARTITION by email)::decimal, 0), 0), 'minutes')::interval tma,
    --ROUND(MIN(extract(epoch from AGE(to_timestamp(t."startedAttendanceAt"/1000), t."createdAt"::timestamp)::interval)/60) OVER (PARTITION by email)::decimal, 0) menor_tme,
    --ROUND(MAX(extract(epoch from AGE(to_timestamp(t."startedAttendanceAt"/1000), t."createdAt"::timestamp)::interval)/60) OVER (PARTITION by email)::decimal, 0) maior_tme,
    concat(coalesce(ROUND(AVG(extract(epoch from AGE(to_timestamp(t."startedAttendanceAt"/1000), t."createdAt"::timestamp)::interval)/60) OVER (PARTITION by email)::decimal, 0), 0), 'minutes')::interval tme
    from "Tickets" t
    left join "Users" u on t."userId" = "u"."id"
    left join "Queues" q on q.id  = t."queueId"
    where t."tenantId" = :tenantId  AND t."userId" = :userId
    and date_trunc('day', t."createdAt") between :startDate and :endDate
    order by 6 Desc
`;
const queryAdmin = `
    select
    distinct(email),
    name,
    count(*) FILTER (where t.status = 'open') OVER (PARTITION by email ) as qtd_em_atendimento,
    count(*) FILTER (where t.status = 'pending') OVER (PARTITION by email) as qtd_pendentes,
    count(*) FILTER (where t.status = 'closed') OVER (PARTITION by email ) as qtd_resolvidos,
    count(*) OVER (PARTITION by email) as qtd_por_usuario,
    --ROUND(MIN(extract(epoch from AGE(to_timestamp(t."closedAt"/1000), t."createdAt")::interval)/60) OVER (PARTITION by email)::decimal, 0) menor_tma,
    --ROUND(MAX(extract(epoch from AGE(to_timestamp(t."closedAt"/1000), t."createdAt")::interval)/60) OVER (PARTITION by email)::decimal, 0) maior_tma,
    concat(coalesce(ROUND(AVG(extract(epoch from AGE(to_timestamp(t."closedAt"/1000), t."createdAt")::interval)/60) OVER (PARTITION by email)::decimal, 0), 0), 'minutes')::interval tma,
    --ROUND(MIN(extract(epoch from AGE(to_timestamp(t."startedAttendanceAt"/1000), t."createdAt"::timestamp)::interval)/60) OVER (PARTITION by email)::decimal, 0) menor_tme,
    --ROUND(MAX(extract(epoch from AGE(to_timestamp(t."startedAttendanceAt"/1000), t."createdAt"::timestamp)::interval)/60) OVER (PARTITION by email)::decimal, 0) maior_tme,
    concat(coalesce(ROUND(AVG(extract(epoch from AGE(to_timestamp(t."startedAttendanceAt"/1000), t."createdAt"::timestamp)::interval)/60) OVER (PARTITION by email)::decimal, 0), 0), 'minutes')::interval tme
    from "Tickets" t
    left join "Users" u on t."userId" = "u"."id"
    left join "Queues" q on q.id  = t."queueId"
    where t."tenantId" = :tenantId
    and date_trunc('day', t."createdAt") between :startDate and :endDate
    order by 6 Desc
`;
const DashTicketsPerUsersDetail = ({ startDate, endDate, tenantId, userId, userProfile }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield database_1.default.query(userProfile == "admin" ? queryAdmin : query, {
        replacements: {
            tenantId,
            startDate,
            endDate,
            userId
        },
        type: sequelize_1.QueryTypes.SELECT
    });
    return data;
});
exports.default = DashTicketsPerUsersDetail;
//# sourceMappingURL=DashTicketsPerUsersDetail.js.map