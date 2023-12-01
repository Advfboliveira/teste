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
exports.getDashTicketsQueue = exports.getDashTicketsPerUsersDetail = exports.getDashTicketsEvolutionByPeriod = exports.getDashTicketsEvolutionChannels = exports.getDashTicketsChannels = exports.getDashTicketsAndTimes = void 0;
// import * as Yup from "yup";
const DashTicketsAndTimes_1 = __importDefault(require("../../services/Statistics/DashTicketsAndTimes"));
const DashTicketsChannels_1 = __importDefault(require("../../services/Statistics/DashTicketsChannels"));
const DashTicketsEvolutionChannels_1 = __importDefault(require("../../services/Statistics/DashTicketsEvolutionChannels"));
const DashTicketsEvolutionByPeriod_1 = __importDefault(require("../../services/Statistics/DashTicketsEvolutionByPeriod"));
const DashTicketsPerUsersDetail_1 = __importDefault(require("../../services/Statistics/DashTicketsPerUsersDetail"));
const DashTicketsQueue_1 = __importDefault(require("../../services/Statistics/DashTicketsQueue"));
const getDashTicketsAndTimes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const data = yield (0, DashTicketsAndTimes_1.default)({
        startDate,
        endDate,
        tenantId,
        userId,
        userProfile
    });
    return res.json(data);
});
exports.getDashTicketsAndTimes = getDashTicketsAndTimes;
const getDashTicketsChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const data = yield (0, DashTicketsChannels_1.default)({
        startDate,
        endDate,
        tenantId,
        userId,
        userProfile
    });
    return res.json(data);
});
exports.getDashTicketsChannels = getDashTicketsChannels;
const getDashTicketsEvolutionChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const data = yield (0, DashTicketsEvolutionChannels_1.default)({
        startDate,
        endDate,
        tenantId,
        userId,
        userProfile
    });
    return res.json(data);
});
exports.getDashTicketsEvolutionChannels = getDashTicketsEvolutionChannels;
const getDashTicketsEvolutionByPeriod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const data = yield (0, DashTicketsEvolutionByPeriod_1.default)({
        startDate,
        endDate,
        tenantId,
        userId,
        userProfile
    });
    return res.json(data);
});
exports.getDashTicketsEvolutionByPeriod = getDashTicketsEvolutionByPeriod;
const getDashTicketsPerUsersDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const data = yield (0, DashTicketsPerUsersDetail_1.default)({
        startDate,
        endDate,
        tenantId,
        userId,
        userProfile
    });
    return res.json(data);
});
exports.getDashTicketsPerUsersDetail = getDashTicketsPerUsersDetail;
const getDashTicketsQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    const userProfile = req.user.profile;
    const data = yield (0, DashTicketsQueue_1.default)({
        startDate,
        endDate,
        tenantId,
        userId,
        userProfile
    });
    return res.json(data);
});
exports.getDashTicketsQueue = getDashTicketsQueue;
//# sourceMappingURL=DashController.js.map