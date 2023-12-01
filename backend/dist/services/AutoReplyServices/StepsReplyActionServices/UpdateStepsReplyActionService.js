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
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const StepsReplyAction_1 = __importDefault(require("../../../models/StepsReplyAction"));
const UpdateStepsReplyActionService = ({ stepsReplyActionData, stepsReplyActionId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { stepReplyId, words, action, userId, queueId, userIdDestination, nextStepId, replyDefinition } = stepsReplyActionData;
    const stepsReplyAction = yield StepsReplyAction_1.default.findOne({
        where: { id: stepsReplyActionId },
        attributes: [
            "id",
            "stepReplyId",
            "words",
            "action",
            "userId",
            "queueId",
            "userIdDestination",
            "nextStepId",
            "replyDefinition"
        ]
    });
    if (!stepsReplyAction) {
        throw new AppError_1.default("ERR_NO_STEP_AUTO_REPLY_FOUND", 404);
    }
    yield stepsReplyAction.update({
        stepReplyId,
        words,
        action,
        userId,
        queueId,
        userIdDestination,
        nextStepId,
        replyDefinition
    });
    yield stepsReplyAction.reload({
        attributes: [
            "id",
            "stepReplyId",
            "words",
            "action",
            "userId",
            "queueId",
            "userIdDestination",
            "nextStepId",
            "replyDefinition"
        ]
    });
    return stepsReplyAction;
});
exports.default = UpdateStepsReplyActionService;
//# sourceMappingURL=UpdateStepsReplyActionService.js.map