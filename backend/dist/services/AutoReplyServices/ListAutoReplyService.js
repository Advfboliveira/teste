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
const AutoReply_1 = __importDefault(require("../../models/AutoReply"));
const StepsReply_1 = __importDefault(require("../../models/StepsReply"));
const StepsReplyAction_1 = __importDefault(require("../../models/StepsReplyAction"));
const ListAutoReplyService = ({ tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    let includeCondition;
    // eslint-disable-next-line prefer-const
    includeCondition = [
        {
            model: StepsReply_1.default,
            include: [
                {
                    model: StepsReplyAction_1.default,
                    as: "stepsReplyAction",
                    attributes: [
                        "id",
                        "stepReplyId",
                        "words",
                        "action",
                        "queueId",
                        "userIdDestination",
                        "nextStepId",
                        "replyDefinition"
                    ]
                }
            ],
            as: "stepsReply",
            attributes: ["id", "reply", "idAutoReply", "userId", "initialStep"]
        }
    ];
    const autoReply = yield AutoReply_1.default.findAll({
        include: includeCondition,
        where: { tenantId },
        order: [[{ model: StepsReply_1.default, as: "stepsReply" }, "id", "ASC"]]
    });
    return { autoReply };
});
exports.default = ListAutoReplyService;
//# sourceMappingURL=ListAutoReplyService.js.map