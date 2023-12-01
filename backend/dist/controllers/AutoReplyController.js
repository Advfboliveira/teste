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
exports.remove = exports.update = exports.index = exports.store = void 0;
const Yup = __importStar(require("yup"));
const CreateAutoReplyService_1 = __importDefault(require("../services/AutoReplyServices/CreateAutoReplyService"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const ListAutoReplyService_1 = __importDefault(require("../services/AutoReplyServices/ListAutoReplyService"));
const UpdateAutoReplyService_1 = __importDefault(require("../services/AutoReplyServices/UpdateAutoReplyService"));
const DeleteAutoReplyService_1 = __importDefault(require("../services/AutoReplyServices/DeleteAutoReplyService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const newAutoReply = Object.assign(Object.assign({}, req.body), { tenantId });
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        action: Yup.number().required(),
        tenantId: Yup.number().required(),
        userId: Yup.number().required()
    });
    try {
        yield schema.validate(newAutoReply);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const autoReply = yield (0, CreateAutoReplyService_1.default)(newAutoReply);
    return res.status(200).json(autoReply);
});
exports.store = store;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const autoReply = yield (0, ListAutoReplyService_1.default)({ tenantId });
    return res.status(200).json(autoReply);
});
exports.index = index;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tenantId } = req.user;
    const autoReplyData = req.body;
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        action: Yup.number().required(),
        userId: Yup.number().required()
    });
    try {
        yield schema.validate(autoReplyData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const { autoReplyId } = req.params;
    const autoReply = yield (0, UpdateAutoReplyService_1.default)({
        autoReplyData,
        autoReplyId,
        tenantId
    });
    return res.status(200).json(autoReply);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tenantId } = req.user;
    const { autoReplyId } = req.params;
    yield (0, DeleteAutoReplyService_1.default)({ id: autoReplyId, tenantId });
    return res.status(200).json({ message: "Auto reply deleted" });
});
exports.remove = remove;
//# sourceMappingURL=AutoReplyController.js.map