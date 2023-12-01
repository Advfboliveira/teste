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
exports.remove = exports.update = exports.index = exports.store = void 0;
const CreateChatFlowService_1 = __importDefault(require("../services/ChatFlowServices/CreateChatFlowService"));
const ListChatFlowService_1 = __importDefault(require("../services/ChatFlowServices/ListChatFlowService"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const UpdateChatFlowService_1 = __importDefault(require("../services/ChatFlowServices/UpdateChatFlowService"));
const DeleteChatFlowService_1 = __importDefault(require("../services/ChatFlowServices/DeleteChatFlowService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const newFlow = {
        flow: Object.assign({}, req.body),
        name: req.body.name,
        isActive: true,
        userId: +req.user.id,
        tenantId
    };
    // const schema = Yup.object().shape({
    //   name: Yup.string().required(),
    //   action: Yup.number().required(),
    //   tenantId: Yup.number().required(),
    //   userId: Yup.number().required()
    // });
    // try {
    //   await schema.validate(newAutoReply);
    // } catch (error) {
    //   throw new AppError(error.message);
    // }
    const chatFlow = yield (0, CreateChatFlowService_1.default)(newFlow);
    return res.status(200).json(chatFlow);
});
exports.store = store;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const chatFlow = yield (0, ListChatFlowService_1.default)({ tenantId });
    return res.status(200).json(chatFlow);
});
exports.index = index;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tenantId } = req.user;
    const newFlow = {
        flow: Object.assign({}, req.body),
        name: req.body.name,
        isActive: req.body.isReactive,
        userId: +req.user.id,
        tenantId
    };
    // const schema = Yup.object().shape({
    //   name: Yup.string().required(),
    //   action: Yup.number().required(),
    //   userId: Yup.number().required()
    // });
    // try {
    //   await schema.validate(autoReplyData);
    // } catch (error) {
    //   throw new AppError(error.message);
    // }
    const { chatFlowId } = req.params;
    const chatFlow = yield (0, UpdateChatFlowService_1.default)({
        chatFlowData: newFlow,
        chatFlowId,
        tenantId
    });
    return res.status(200).json(chatFlow);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatFlowId } = req.params;
    const { tenantId } = req.user;
    yield (0, DeleteChatFlowService_1.default)({ id: chatFlowId, tenantId });
    return res.status(200).json({ message: "Flow deleted" });
});
exports.remove = remove;
// export const remove = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   if (req.user.profile !== "admin") {
//     throw new AppError("ERR_NO_PERMISSION", 403);
//   }
//   const { tenantId } = req.user;
//   const { autoReplyId } = req.params;
//   await DeleteAutoReplyService({ id: autoReplyId, tenantId });
//   return res.status(200).json({ message: "Auto reply deleted" });
// };
//# sourceMappingURL=ChatFlowController.js.map