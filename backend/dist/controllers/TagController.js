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
const AppError_1 = __importDefault(require("../errors/AppError"));
const CreateTagService_1 = __importDefault(require("../services/TagServices/CreateTagService"));
const ListTagService_1 = __importDefault(require("../services/TagServices/ListTagService"));
const DeleteTagService_1 = __importDefault(require("../services/TagServices/DeleteTagService"));
const UpdateTagService_1 = __importDefault(require("../services/TagServices/UpdateTagService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const newTag = Object.assign(Object.assign({}, req.body), { userId: req.user.id, tenantId });
    const schema = Yup.object().shape({
        tag: Yup.string().required(),
        color: Yup.string().required(),
        userId: Yup.number().required(),
        tenantId: Yup.number().required()
    });
    try {
        yield schema.validate(newTag);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const tag = yield (0, CreateTagService_1.default)(newTag);
    return res.status(200).json(tag);
});
exports.store = store;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { isActive } = req.query;
    const tags = yield (0, ListTagService_1.default)({
        tenantId,
        // eslint-disable-next-line eqeqeq
        isActive: isActive ? isActive == "true" : false
    });
    return res.status(200).json(tags);
});
exports.index = index;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const tagData = Object.assign(Object.assign({}, req.body), { userId: req.user.id, tenantId });
    const schema = Yup.object().shape({
        tag: Yup.string().required(),
        color: Yup.string().required(),
        isActive: Yup.boolean().required(),
        userId: Yup.number().required()
    });
    try {
        yield schema.validate(tagData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const { tagId } = req.params;
    const tagObj = yield (0, UpdateTagService_1.default)({
        tagData,
        tagId
    });
    return res.status(200).json(tagObj);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tagId } = req.params;
    yield (0, DeleteTagService_1.default)({ id: tagId, tenantId });
    return res.status(200).json({ message: "Tag deleted" });
});
exports.remove = remove;
//# sourceMappingURL=TagController.js.map