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
const sequelize_1 = require("sequelize");
const AutoReply_1 = __importDefault(require("../../models/AutoReply"));
const StepsReply_1 = __importDefault(require("../../models/StepsReply"));
// import StepsReply from "../../models/StepsReply";
const StepsReplyAction_1 = __importDefault(require("../../models/StepsReplyAction"));
// import AppError from "../../errors/AppError";
const VerifyActionStepAutoReplyService = (stepAutoReplyId, msg, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!msg) {
        return null;
    }
    const actions = yield StepsReplyAction_1.default.findOne({
        where: {
            stepReplyId: stepAutoReplyId,
            // words: msg
            words: (0, sequelize_1.where)((0, sequelize_1.fn)("lower", (0, sequelize_1.col)("words")), (0, sequelize_1.fn)("lower", msg))
        },
        include: [
            {
                model: StepsReply_1.default,
                as: "stepsReply",
                include: [{ model: AutoReply_1.default, as: "autoReply", where: { tenantId } }]
            }
        ]
        // include: [
        //   {
        //     model: StepsReply,
        //     where: { id: stepAutoReplyId }, // action 0 - AutoReply Criacao ticket ou 1 - Resolução do ticket
        //     attributes: ["id", "reply", "stepOrder"]
        //   }
        // ]
    });
    // if (!actions) {
    //   return null;
    // }
    return actions;
});
exports.default = VerifyActionStepAutoReplyService;
//# sourceMappingURL=VerifyActionStepAutoReplyService.js.map