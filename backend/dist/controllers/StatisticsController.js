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
exports.ContactsReport = exports.DashTicketsQueues = void 0;
const TicketsQueuesService_1 = __importDefault(require("../services/Statistics/TicketsQueuesService"));
const ContactsReportService_1 = __importDefault(require("../services/Statistics/ContactsReportService"));
const DashTicketsQueues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, profile, id: userId } = req.user;
    const { dateStart, dateEnd, status, queuesIds, showAll } = req.query;
    const tickets = yield (0, TicketsQueuesService_1.default)({
        showAll: profile === "admin" ? showAll : false,
        dateStart,
        dateEnd,
        status,
        queuesIds,
        userId,
        tenantId
    });
    return res.status(200).json(tickets);
});
exports.DashTicketsQueues = DashTicketsQueues;
const ContactsReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    // if (req.user.profile !== "admin") {
    //   throw new AppError("ERR_NO_PERMISSION", 403);
    // }
    const { startDate, endDate, tags, ddds, searchParam } = req.query;
    const tickets = yield (0, ContactsReportService_1.default)({
        startDate,
        endDate,
        tags,
        ddds,
        tenantId,
        profile: req.user.profile,
        userId: +req.user.id,
        searchParam
    });
    return res.status(200).json(tickets);
});
exports.ContactsReport = ContactsReport;
//# sourceMappingURL=StatisticsController.js.map