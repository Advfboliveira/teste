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
exports.renewTokenApi = exports.remove = exports.update = exports.index = exports.store = void 0;
const Yup = __importStar(require("yup"));
const CreateApiConfigService_1 = __importDefault(require("../services/ApiConfigServices/CreateApiConfigService"));
const ListApiConfigService_1 = __importDefault(require("../services/ApiConfigServices/ListApiConfigService"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const UpdateApiConfigService_1 = __importDefault(require("../services/ApiConfigServices/UpdateApiConfigService"));
const DeleteApiConfigService_1 = __importDefault(require("../services/ApiConfigServices/DeleteApiConfigService"));
const RenewApiConfigTokenService_1 = __importDefault(require("../services/ApiConfigServices/RenewApiConfigTokenService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, id } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const newApi = Object.assign(Object.assign({}, req.body), { userId: id, tenantId });
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        sessionId: Yup.number().required(),
        urlServiceStatus: Yup.string().url().nullable(),
        urlMessageStatus: Yup.string().url().nullable(),
        userId: Yup.number().required(),
        tenantId: Yup.number().required()
    });
    try {
        yield schema.validate(newApi);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const api = yield (0, CreateApiConfigService_1.default)(newApi);
    return res.status(200).json(api);
});
exports.store = store;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const apis = yield (0, ListApiConfigService_1.default)({ tenantId });
    return res.status(200).json(apis);
});
exports.index = index;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tenantId, id } = req.user;
    const { apiId } = req.params;
    const apiData = Object.assign(Object.assign({}, req.body), { userId: id, tenantId });
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        sessionId: Yup.number().required(),
        urlServiceStatus: Yup.string().url().nullable(),
        urlMessageStatus: Yup.string().url().nullable(),
        userId: Yup.number().required(),
        tenantId: Yup.number().required(),
        isActive: Yup.boolean().required()
    });
    try {
        yield schema.validate(apiData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const api = yield (0, UpdateApiConfigService_1.default)({
        apiData,
        apiId,
        tenantId
    });
    return res.status(200).json(api);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tenantId } = req.user;
    const { apiId } = req.params;
    yield (0, DeleteApiConfigService_1.default)({ apiId, tenantId });
    return res.status(200).json({ message: "API Config Deleted" });
});
exports.remove = remove;
const renewTokenApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { tenantId, id } = req.user;
    const { apiId } = req.params;
    const api = Object.assign(Object.assign({}, req.body), { userId: id, tenantId });
    const schema = Yup.object().shape({
        sessionId: Yup.number().required(),
        userId: Yup.number().required(),
        tenantId: Yup.number().required()
    });
    try {
        yield schema.validate(api);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const newApi = yield (0, RenewApiConfigTokenService_1.default)({
        apiId,
        userId: api.userId,
        sessionId: api.sessionId,
        tenantId: api.tenantId
    });
    return res.status(200).json(newApi);
});
exports.renewTokenApi = renewTokenApi;
//# sourceMappingURL=APIConfigController.js.map