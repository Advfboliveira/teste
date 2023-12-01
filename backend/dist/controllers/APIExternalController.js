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
exports.startSession = exports.sendMessageAPI = void 0;
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const ApiConfig_1 = __importDefault(require("../models/ApiConfig"));
const Queue_1 = __importDefault(require("../libs/Queue"));
const ShowWhatsAppService_1 = __importDefault(require("../services/WhatsappService/ShowWhatsAppService"));
const StartWhatsAppSession_1 = require("../services/WbotServices/StartWhatsAppSession");
const wbot_1 = require("../libs/wbot");
const sendMessageAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, sessionId } = req.APIAuth;
    const { apiId } = req.params;
    const media = req.file;
    // eslint-disable-next-line eqeqeq
    // if (!apiIdParam || apiId != apiIdParam) {
    //   throw new AppError("ERR_APIID_NO_PERMISSION", 403);
    // }
    const APIConfig = yield ApiConfig_1.default.findOne({
        where: {
            id: apiId,
            tenantId
        }
    });
    if ((APIConfig === null || APIConfig === void 0 ? void 0 : APIConfig.sessionId) !== sessionId) {
        throw new AppError_1.default("ERR_SESSION_NOT_AUTH_TOKEN", 403);
    }
    const newMessage = Object.assign(Object.assign({}, req.body), { apiId,
        sessionId,
        tenantId, apiConfig: APIConfig, media });
    const schema = Yup.object().shape({
        apiId: Yup.string(),
        sessionId: Yup.number(),
        body: Yup.string().required(),
        number: Yup.string().required(),
        mediaUrl: Yup.string().url().nullable() ||
            Yup.object().shape({
                destination: Yup.string().required(),
                encoding: Yup.string().required(),
                fieldname: Yup.string().required(),
                filename: Yup.string().required(),
                mimetype: Yup.string().required(),
                originalname: Yup.string().required(),
                path: Yup.string().required(),
                size: Yup.number().required()
            }),
        externalKey: Yup.string().required(),
        tenantId: Yup.number().required()
    });
    try {
        yield schema.validate(newMessage);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    Queue_1.default.add("SendMessageAPI", newMessage);
    return res.status(200).json({ message: "Message add queue" });
});
exports.sendMessageAPI = sendMessageAPI;
const startSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId, sessionId } = req.APIAuth;
    const { apiId } = req.params;
    const APIConfig = yield ApiConfig_1.default.findOne({
        where: {
            id: apiId,
            tenantId
        }
    });
    if ((APIConfig === null || APIConfig === void 0 ? void 0 : APIConfig.sessionId) !== sessionId) {
        throw new AppError_1.default("ERR_SESSION_NOT_AUTH_TOKEN", 403);
    }
    const whatsapp = yield (0, ShowWhatsAppService_1.default)({
        id: APIConfig.sessionId,
        tenantId: APIConfig.tenantId,
        isInternal: true
    });
    try {
        const wbot = (0, wbot_1.getWbot)(APIConfig.sessionId);
        const isConnectStatus = (yield wbot.getState()) === "CONNECTED";
        if (!isConnectStatus) {
            throw new Error("Necessário iniciar sessão");
        }
    }
    catch (error) {
        (0, StartWhatsAppSession_1.StartWhatsAppSession)(whatsapp);
    }
    return res.status(200).json(whatsapp);
});
exports.startSession = startSession;
//# sourceMappingURL=APIExternalController.js.map