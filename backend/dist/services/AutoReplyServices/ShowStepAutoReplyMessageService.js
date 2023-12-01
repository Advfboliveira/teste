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
// import { Op } from "sequelize";
const AutoReply_1 = __importDefault(require("../../models/AutoReply"));
const StepsReply_1 = __importDefault(require("../../models/StepsReply"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// import User from "../../models/User";
const ShowStepAutoReplyMessageService = (action, idAutoReply, stepId, initialStep = false, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {};
    if (initialStep) {
        where.initialStep = initialStep;
    }
    else {
        where.idAutoReply = idAutoReply;
        where.id = stepId;
    }
    const stepReply = yield StepsReply_1.default.findOne({
        // attributes: ["id", "reply", "stepOrder"],
        where,
        include: [
            {
                model: AutoReply_1.default,
                where: { action, tenantId } // action 0 - AutoReply Criacao ticket ou 1 - Resolução do ticket
                // attributes: ["id", "name"]
            }
        ]
        // logging: console.log
    });
    if (!stepReply) {
        throw new AppError_1.default("ERR_NO_STEP_AUTO_REPLY_FOUND", 404);
    }
    return stepReply;
});
exports.default = ShowStepAutoReplyMessageService;
//# sourceMappingURL=ShowStepAutoReplyMessageService.js.map