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
exports.remove = exports.update = exports.store = void 0;
const Yup = __importStar(require("yup"));
const CreateStepsReplyService_1 = __importDefault(require("../services/AutoReplyServices/StepsReplyServices/CreateStepsReplyService"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const UpdateStepsReplyService_1 = __importDefault(require("../services/AutoReplyServices/StepsReplyServices/UpdateStepsReplyService"));
const DeleteStepsReplyService_1 = __importDefault(require("../services/AutoReplyServices/StepsReplyServices/DeleteStepsReplyService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const newStepsReply = Object.assign(Object.assign({}, req.body), { userId: req.user.id });
    const schema = Yup.object().shape({
        reply: Yup.string().required(),
        idAutoReply: Yup.number().required(),
        userId: Yup.number().required(),
        initialStep: Yup.boolean().required()
    });
    try {
        yield schema.validate(newStepsReply);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const stepsReply = yield (0, CreateStepsReplyService_1.default)(newStepsReply);
    return res.status(200).json(stepsReply);
});
exports.store = store;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const stepsReplyData = req.body;
    const schema = Yup.object().shape({
        reply: Yup.string().required(),
        idAutoReply: Yup.number().required(),
        userId: Yup.number().required(),
        initialStep: Yup.boolean().required()
    });
    try {
        yield schema.validate(stepsReplyData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const { stepsReplyId } = req.params;
    const stepsReply = yield (0, UpdateStepsReplyService_1.default)({
        stepsReplyData,
        stepsReplyId
    });
    return res.status(200).json(stepsReply);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { stepsReplyId } = req.params;
    yield (0, DeleteStepsReplyService_1.default)(stepsReplyId);
    return res.status(200).json({ message: "Steps reply deleted" });
});
exports.remove = remove;
//# sourceMappingURL=StepsReplyController.js.map