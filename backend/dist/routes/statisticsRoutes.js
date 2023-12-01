"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const StatisticsController = __importStar(require("../controllers/StatisticsController"));
const StatisticsPerUsersController = __importStar(require("../controllers/Statistics/StatisticsPerUsersController"));
const DashController = __importStar(require("../controllers/Statistics/DashController"));
const statisticsRoutes = express_1.default.Router();
statisticsRoutes.get("/dash-tickets-queues", isAuth_1.default, StatisticsController.DashTicketsQueues);
statisticsRoutes.get("/contacts-report", isAuth_1.default, StatisticsController.ContactsReport);
statisticsRoutes.get("/statistics-per-users", isAuth_1.default, StatisticsPerUsersController.index);
statisticsRoutes.get("/statistics-tickets-times", isAuth_1.default, DashController.getDashTicketsAndTimes);
statisticsRoutes.get("/statistics-tickets-channels", isAuth_1.default, DashController.getDashTicketsChannels);
statisticsRoutes.get("/statistics-tickets-evolution-channels", isAuth_1.default, DashController.getDashTicketsEvolutionChannels);
statisticsRoutes.get("/statistics-tickets-evolution-by-period", isAuth_1.default, DashController.getDashTicketsEvolutionByPeriod);
statisticsRoutes.get("/statistics-tickets-per-users-detail", isAuth_1.default, DashController.getDashTicketsPerUsersDetail);
statisticsRoutes.get("/statistics-tickets-queue", isAuth_1.default, DashController.getDashTicketsQueue);
exports.default = statisticsRoutes;
//# sourceMappingURL=statisticsRoutes.js.map