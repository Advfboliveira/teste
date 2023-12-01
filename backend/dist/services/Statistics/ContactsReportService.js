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
const date_fns_1 = require("date-fns");
const sequelize_1 = require("sequelize");
const Contact_1 = __importDefault(require("../../models/Contact"));
const Tag_1 = __importDefault(require("../../models/Tag"));
const ContactWallet_1 = __importDefault(require("../../models/ContactWallet"));
const dddsPorEstado = [
    { estado: "AC", ddds: ["68"] },
    { estado: "AL", ddds: ["82"] },
    { estado: "AM", ddds: ["92", "97"] },
    { estado: "AP", ddds: ["96"] },
    { estado: "BA", ddds: ["71", "73", "74", "75", "77"] },
    { estado: "CE", ddds: ["85", "88"] },
    { estado: "DF", ddds: ["61"] },
    { estado: "ES", ddds: ["27", "28"] },
    { estado: "GO", ddds: ["62", "64"] },
    { estado: "MA", ddds: ["98", "99"] },
    { estado: "MG", ddds: ["31", "32", "33", "34", "35", "37", "38"] },
    { estado: "MS", ddds: ["67"] },
    { estado: "MT", ddds: ["65", "66"] },
    { estado: "PA", ddds: ["91", "93", "94"] },
    { estado: "PB", ddds: ["83"] },
    { estado: "PE", ddds: ["81", "87"] },
    { estado: "PI", ddds: ["86", "89"] },
    { estado: "PR", ddds: ["41", "42", "43", "44", "45", "46"] },
    { estado: "RJ", ddds: ["21", "22", "24"] },
    { estado: "RN", ddds: ["84"] },
    { estado: "RO", ddds: ["69"] },
    { estado: "RR", ddds: ["95"] },
    { estado: "RS", ddds: ["51", "53", "54", "55"] },
    { estado: "SC", ddds: ["47", "48", "49"] },
    { estado: "SE", ddds: ["79"] },
    {
        estado: "SP",
        ddds: ["11", "12", "13", "14", "15", "16", "17", "18", "19"]
    },
    { estado: "TO", ddds: ["63"] }
];
const ListContactsService = ({ startDate, endDate, tenantId, tags, ddds, userId, profile, searchParam }) => __awaiter(void 0, void 0, void 0, function* () {
    let includeCondition = [];
    let where = {
        tenantId,
        isGroup: false
    };
    if (searchParam) {
        where = Object.assign(Object.assign({}, where), { [sequelize_1.Op.or]: [
                {
                    name: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("LOWER", sequelize_1.Sequelize.col("Contact.name")), "LIKE", `%${searchParam.toLowerCase().trim()}%`)
                },
                { number: { [sequelize_1.Op.like]: `%${searchParam.toLowerCase().trim()}%` } }
            ] });
    }
    if (startDate && endDate) {
        where = Object.assign(Object.assign({}, where), { createdAt: {
                [sequelize_1.Op.between]: [
                    +(0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(startDate)),
                    +(0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(endDate))
                ]
            } });
    }
    if (tags) {
        includeCondition = [
            {
                model: Tag_1.default,
                as: "tags",
                where: {
                    id: {
                        [sequelize_1.Op.in]: tags
                    }
                },
                required: true
            }
        ];
    }
    if (ddds) {
        let dddsFilter = [];
        // eslint-disable-next-line consistent-return
        ddds.forEach((el) => {
            var _a;
            if (el) {
                const d = (_a = dddsPorEstado.find((ddd) => ddd.estado === el)) === null || _a === void 0 ? void 0 : _a.ddds;
                if (d) {
                    dddsFilter = dddsFilter.concat(d);
                }
            }
        });
        where = Object.assign(Object.assign({}, where), { number: {
                [sequelize_1.Op.or]: dddsFilter.map(ddd => ({ [sequelize_1.Op.like]: `55${ddd}%` }))
            } });
    }
    if (profile !== "admin") {
        includeCondition.push({
            model: ContactWallet_1.default,
            as: "wallet",
            where: {
                walletId: userId
            },
            required: true
        });
    }
    const contacts = yield Contact_1.default.findAll({
        where,
        attributes: ["id", "name", "number", "email"],
        include: includeCondition,
        order: [["name", "ASC"]]
    });
    return { contacts };
});
exports.default = ListContactsService;
//# sourceMappingURL=ContactsReportService.js.map