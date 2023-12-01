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
const date_fns_1 = require("date-fns");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const UsersQueues_1 = __importDefault(require("../../models/UsersQueues"));
const User_1 = __importDefault(require("../../models/User"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const TicketsQueuesService = ({ dateStart, dateEnd, status, userId, queuesIds, tenantId, showAll }) => __awaiter(void 0, void 0, void 0, function* () {
    let whereCondition = {
    // [Op.or]: [{ userId }, { status: "pending" }]
    };
    const includeCondition = [
        {
            model: Contact_1.default,
            as: "contact",
            attributes: ["id", "name", "number", "profilePicUrl"]
        },
        {
            model: User_1.default,
            as: "user",
            attributes: ["id", "name", "profile"]
        }
    ];
    const isExistsQueues = yield Queue_1.default.count({ where: { tenantId } });
    // eslint-disable-next-line eqeqeq
    if (isExistsQueues) {
        const queues = yield UsersQueues_1.default.findAll({
            where: {
                userId
            }
        });
        let queuesIdsUser = queues.map(q => q.queueId);
        if (queuesIds) {
            const newArray = [];
            queuesIds.forEach(i => {
                const idx = queuesIdsUser.indexOf(+i);
                if (idx) {
                    newArray.push(+i);
                }
            });
            queuesIdsUser = newArray;
        }
        whereCondition = Object.assign(Object.assign({}, whereCondition), { queueId: {
                [sequelize_1.Op.in]: queuesIdsUser
            } });
    }
    // eslint-disable-next-line eqeqeq
    if (showAll == "true") {
        whereCondition = {};
    }
    if (status) {
        whereCondition = Object.assign(Object.assign({}, whereCondition), { status });
    }
    else {
        status = ["open", "pending"];
        // throw new AppError("ERR_NO_STATUS_SELECTED", 404);
    }
    if (dateStart && dateEnd) {
        whereCondition = Object.assign(Object.assign({}, whereCondition), { createdAt: {
                [sequelize_1.Op.between]: [
                    +(0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(dateStart)),
                    +(0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(dateEnd))
                ]
            } });
    }
    const tickets = yield Ticket_1.default.findAll({
        where: Object.assign(Object.assign({}, whereCondition), { 
            // queueId: {
            //   [Op.in]: queuesIdsUser
            // },
            tenantId }),
        include: includeCondition,
        order: [["updatedAt", "DESC"]]
    });
    return tickets;
});
exports.default = TicketsQueuesService;
//# sourceMappingURL=TicketsQueuesService.js.map